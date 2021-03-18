import MainTemplate from "./MainTemplate";

/**
 * All the Agility Page Template components that are in use in this site.
 */
const allTemplates = [{ name: "MainTemplate", template: MainTemplate }];

export const getPageTemplate = (templateName) => {
  if (!templateName) return null;
  const obj = allTemplates.find(
    (m) => m.name.toLowerCase() === templateName.toLowerCase()
  );
  if (!obj) return null;
  return obj?.template;
};
