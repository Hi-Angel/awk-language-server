import { Diagnostic, _Connection } from 'vscode-languageserver/node'
import { nodesGen } from '../utils'
import { Tree } from 'web-tree-sitter'
import { SymbolsByUri } from '../interfaces'
import { DependencyMap } from '../dependencies'
import { Documentation } from '../documentation'
import { Validator } from './validator'
import { validateSyntaxError } from './syntaxError'
import { validateMissingNode } from './missingNode'
import { validateBuiltinName } from './builtinName'
import { validateNameCollision } from './nameCollision'
import { validateIncludeExists } from './includeExists'
import { validateNextPlacement } from './nextPlacement'
import { validateContinuePlacement } from './continuePlacement'

const validators: Validator[] = [
  validateSyntaxError,
  validateMissingNode,
  validateBuiltinName,
  validateNameCollision,
  validateIncludeExists,
  validateNextPlacement,
  validateContinuePlacement,
]

export function validate(
  tree: Tree,
  symbols: SymbolsByUri,
  dependencies: DependencyMap,
  uri: string,
  docs: Documentation,
): Diagnostic[] {
  const diagnostics: Diagnostic[] = []

  for (const node of nodesGen(tree.rootNode)) {
    for (const v of validators) {
      const result = v({
        node,
        symbols,
        dependencies,
        uri,
        docs,
      })

      if (result) {
        diagnostics.push(result)
        break
      }
    }
  }

  return diagnostics
}
