import {cacheConfig} from "lib/cms/cacheConfig"

/**
 * the root page - just pull exports from the main slug...
 */
export {generateMetadata} from "./[...slug]/page"
export {default} from "./[...slug]/page"

export const revalidate = cacheConfig.pathRevalidateDuration
export const runtime = "nodejs"
export const dynamic = "force-static"
