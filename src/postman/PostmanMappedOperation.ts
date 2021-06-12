import { Event, Item, ItemGroup } from 'postman-collection'
import { OasMappedOperation } from '../oas'

export type PostmanMappedOperationOptions = {
  item: Item
  operationIdMap?: Record<string, OasMappedOperation>
  id?: string
}

export class PostmanMappedOperation {
  public id?: string
  public path: string
  public method: string
  public pathRef: string
  public pathVar: string
  public requestHeaders: Record<string, unknown>
  public queryParams: Record<string, unknown>
  public pathParams: Record<string, unknown>
  public testJsonDataInjected: boolean
  public item: Item

  constructor(options: PostmanMappedOperationOptions) {
    const { item, operationIdMap, id } = options
    this.item = item
    const { request } = item

    this.method = request.method.toUpperCase()
    this.path = request.url.path ? `/${request.url.path.join('/')}` : '/'
    this.pathRef = this.normalizedPathRef(this.method)
    this.pathVar = this.normalizedPathVar(this.method)

    this.requestHeaders = request.headers.toJSON().map(({ key, value, description }) => {
      return { name: key, value, description: description?.content }
    })

    this.queryParams = request.url.query.map(({ key, value }) => {
      return { name: key, value }
    })

    this.pathParams = request.url.variables.toJSON().map(({ key, value, description }) => {
      return { name: key, value, description: description?.content }
    })

    this.id = operationIdMap ? operationIdMap[this.pathRef]?.id : (id as string)
    this.testJsonDataInjected = false
  }

  public getTests(): Event {
    return this.item.events.find(e => e?.listen === 'test', null)
  }

  getParent(): ItemGroup<Item> | null {
    const parent = this.item.parent()
    const isParent = ItemGroup.isItemGroup(parent)
    return isParent ? (parent as ItemGroup<Item>) : null
  }

  public getParentFolderId(): string | null {
    const parent = this.getParent()
    return parent ? parent.id : null
  }

  public getParentFolderName(): string | null {
    const parent = this.getParent()
    return parent ? parent.name : null
  }

  public clone(name?: string): PostmanMappedOperation {
    const clonedJsonItem = { ...this.item.toJSON() }
    const { id, ...clone } = clonedJsonItem
    if (name) {
      clone.name = name
      clone?.request ? (clone.request.name = name) : null
    }
    const clonedPmItem = new Item(clone)
    return new PostmanMappedOperation({ item: clonedPmItem, id: `${this.id}-clone` })
  }

  private normalizedPathRef(method: string): string {
    const {
      item: {
        request: { url }
      }
    } = this

    const path = url?.path
      ?.map(segment => {
        return segment.includes(':') ? `{${segment}}`.replace(':', '') : segment
      })
      .join('/')
    return `${method}::/${path}`
  }

  private normalizedPathVar(method: string): string {
    const {
      item: {
        request: { url }
      }
    } = this

    const path = url?.path
      ?.map(segment => {
        return segment.includes(':') ? `{${segment}}`.replace(':', '') : segment
      })
      .join('/')
      .replace(/#|\//g, '-')
    return `${method.toLowerCase()}::${path}`
  }
}
