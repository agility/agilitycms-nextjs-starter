import { ApiOptions, ComponentWithInit, ModuleWithInit } from "@agility/nextjs";
import { GetStaticPropsContext } from "next/types";


interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> {}
/**
 * Extension of the GetStaticPropsContext type for Agility CMS.
 * Adds the globalComponents array and getter methods for modules and page templates.
 *
 * @export
 * @interface AgilityGetStaticPropsContext
 * @extends {GetStaticPropsContext<Q>}
 * @template Q
 */
export interface AgilityGetStaticPropsContext<Q extends ParsedUrlQuery = ParsedUrlQuery> extends GetStaticPropsContext<Q> {
    /**
     * A dictionary of the global components (such as header/footer) that have a getCustomInitialProps method.
     * Adding a component to this will add results of that method call to the globalData dictionary available in the page props
     *
     * @type {{ [ name: string ] : ComponentWithInit  }}
     * @memberof AgilityGetStaticPropsContext
     */
    globalComponents?: {
        [name: string]: ComponentWithInit;
    };
    /**
     * A function that will return the component for a given module.
     * If the component has a getCustomInitialProps method,
     * that method will be called the result added to the customData dictionary available in the module props.
     * This is OPTIONAL since we don't need it with app router implementations.
     *
     * @param {string} componentName
     * @returns {(FC | ClassicComponent)}
     * @memberof AgilityGetStaticPropsContext
     */
    getComponent?: (componentName: string) => ModuleWithInit | null;
    apiOptions?: ApiOptions;
}