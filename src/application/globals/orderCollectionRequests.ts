/* eslint-disable @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any */
export const orderCollectionRequests = (obj: any, orderOfOperations: any = []): any => {
  // Normalize orderOfOperations ({id}) to match with Postman format (:id)
  const orderOfOperationsNorm = orderOfOperations.map(item =>
    item.replace('{', ':').replace('}', '')
  )

  obj.item.map(pmFolder => {
    if (pmFolder.item && pmFolder.item.length > 0) {
      if (pmFolder.item[0]?.item) return //skip nested folders for now
      // Go into Postman folder
      pmFolder.item.map(request => {
        //Normalize Postman request url paths for sorting
        const postmanPath = request.request.url.path.join('/')
        // let postmanPath = request.request.url.path.join('/').replace(/:([^\s]+)/g,'{$1}')
        const postmanMethod = request.request.method
        request._portman_operation = postmanMethod + '::/' + postmanPath
      })
    }
    // Sort items
    pmFolder.item = pmFolder.item.sort(propComparatorPortmanOperation(orderOfOperationsNorm))
  })
  return obj
}

/**
 * Compare function - Sort with priority logic for items in array, keep order for non-priority items
 * @param priorityArr Array with priority items
 * @returns {(function(*=, *=): (number|number))|*}
 */
const propComparatorPortmanOperation = (priorityArr: any): any => {
  return (a, b) => {
    if (
      a['_portman_operation'] &&
      b['_portman_operation'] &&
      a['_portman_operation'] === b['_portman_operation']
    ) {
      return 0
    }
    if (!Array.isArray(priorityArr)) {
      return 0
    }
    const ia = priorityArr.indexOf(a['_portman_operation'])
    const ib = priorityArr.indexOf(b['_portman_operation'])
    if (ia !== -1) {
      return ib !== -1 ? ia - ib : -1
    }
    return ib !== -1 || a > b ? 1 : a < b ? -1 : 0
  }
}
