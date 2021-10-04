export function difference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const result = new Set<T>()

  set1.forEach((value: T) => {
    if (!set2.has(value)) result.add(value)
  })

  return result
}

export class DependencyNode {
  public parentUris: Set<string> = new Set()
  public childrenUris: Set<string> = new Set()
}

export class DependencyMap extends Map<string, DependencyNode> {
  public get(uri: string): DependencyNode {
    if (!super.get(uri)) super.set(uri, new DependencyNode())

    return super.get(uri) as DependencyNode
  }

  public update(uri: string, newDependencies: Set<string>): void {
    const oldDependencies = this.get(uri).childrenUris

    difference(oldDependencies, newDependencies).forEach((childUri: string) => {
      this.get(childUri).parentUris.delete(uri)
    })

    newDependencies.forEach((childUri: string) => {
      this.get(childUri).parentUris.add(uri)
    })

    this.get(uri).childrenUris = newDependencies
  }

  public hasParent(uri: string, parentUri: string): boolean {
    const { parentUris } = this.get(uri)

    if (parentUris.has(parentUri)) return true

    for (const pu of parentUris) {
      if (this.hasParent(pu, parentUri)) return true
    }

    return false
  }

  /**
   * Get entire dependency tree flattened to a list of URIs
   */
  public getAll(uri: string): Set<string> {
    const result = new Set<string>()
    const queue = [uri]

    result.add(uri)

    while (queue.length) {
      const uri = queue.shift() as string

      this.get(uri).childrenUris.forEach((u) => {
        result.add(u)
        queue.push(u)
      })
    }

    return result
  }
}