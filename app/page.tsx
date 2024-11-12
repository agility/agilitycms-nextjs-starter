/**
 * the root page - just pull exports from the main slug...
 */
export {/* @next-codemod-error `generateMetadata` export is re-exported. Check if this component uses `params` or `searchParams`*/
generateMetadata} from "./[...slug]/page"
export {/* @next-codemod-error `default` export is re-exported. Check if this component uses `params` or `searchParams`*/
default} from "./[...slug]/page"

export const revalidate = 60
export const runtime = "nodejs"
export const dynamic = "force-static"
