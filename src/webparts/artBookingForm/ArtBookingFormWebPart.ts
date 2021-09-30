import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ArtBookingFormWebPartStrings';
import { ArtBookingForm } from './components/ArtBookingForm';
import { IArtBookingFormProps } from './components/IArtBookingFormProps';
import { sp } from '@pnp/sp';
import { HomePage } from './components/ArtBookingHome';
export interface IArtBookingFormWebPartProps {
  listName: string;
}

export default class ArtBookingFormWebPart extends BaseClientSideWebPart<IArtBookingFormWebPartProps> {

  public render(): void {
    sp.setup({
      spfxContext: this.context
    });
    const element: React.ReactElement<{}> = React.createElement(
      HomePage,
      {
        listName: this.properties.listName,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }


  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('listName', {
                  label: 'List Name'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
