
import { AgilityPageProps } from "lib/types/Page";
import { AgilityGetStaticPropsContext } from "lib/types/Props";

/**
 * Get the props for a page.
 * @param param0
 * @returns
 */

declare const getAgilityPageProps: ({
  params,
  preview,
  locale,
  defaultLocale,
  getComponent,
  globalComponents,
  apiOptions,
}: AgilityGetStaticPropsContext) => Promise<AgilityPageProps>;

export { getAgilityPageProps };