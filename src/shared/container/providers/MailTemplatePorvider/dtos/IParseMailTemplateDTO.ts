interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IMailTemplateProvider {
  file: string;
  variables: ITemplateVariables;
}
