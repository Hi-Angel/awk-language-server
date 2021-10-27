import { Location, ReferenceParams } from 'vscode-languageserver/node'
import { DependencyMap } from '../dependencies'
import { TreesByUri } from '../interfaces'
import { findReferences, getName, getNodeAt, getParentFunction } from '../utils'

export function getReferencesHandler(trees: TreesByUri, dependencies: DependencyMap) {
  return function handleReferences(params: ReferenceParams): Location[] {
    const { textDocument, position } = params
    const node = getNodeAt(trees[textDocument.uri], position.line, position.character)

    if (!node) return []

    const name = getName(node)

    if (!name) return []

    const parentFunc = getParentFunction(node)

    if (parentFunc) {
      return findReferences(trees[textDocument.uri], name, parentFunc).map((range) =>
        Location.create(textDocument.uri, range),
      )
    }

    const result: Location[] = []

    for (const uri of Object.keys(trees)) {
      if (
        uri !== textDocument.uri &&
        !dependencies.hasParent(textDocument.uri, uri) &&
        !dependencies.hasParent(uri, textDocument.uri)
      )
        continue

      result.push(
        ...findReferences(trees[uri], name, parentFunc).map((range) =>
          Location.create(uri, range),
        ),
      )
    }

    return result
  }
}