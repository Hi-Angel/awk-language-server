import { URL } from 'url'
import { analyze } from '../analyze'
import { DependencyMap } from '../dependencies'
import { Context, SymbolsByUri, TreesByUri } from '../interfaces'
import { getAwkFilesInDir, readDocumentFromUrl } from '../io'

export function getInitializedHandler(
  context: Context,
  trees: TreesByUri,
  symbols: SymbolsByUri,
  dependencies: DependencyMap,
) {
  return async function handleInitialized() {
    const progressReporter = await context.connection.window.createWorkDoneProgress()

    progressReporter.begin('Indexing')

    const workspaceFolders = await context.connection.workspace.getWorkspaceFolders()
    const urls: URL[] = (workspaceFolders ?? []).flatMap((folder) =>
      getAwkFilesInDir(folder.uri),
    )

    // Analyze every file in a workspace
    for (const url of urls) {
      const document = readDocumentFromUrl(context, url)

      if (!document) continue

      const { tree, symbols: s, dependencyUris } = analyze(context, document)

      trees[url.href] = tree
      symbols[url.href] = s
      dependencies.update(url.href, new Set(dependencyUris))
    }

    progressReporter.done()
  }
}