interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IMailTemplateProvider {
  template: string;
  variables: ITemplateVariables;
}
