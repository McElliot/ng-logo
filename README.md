# Excel Exporter

Given data or any service returned data can be exportable with this component to Excel

- **@Input() data: any** - Will be displayed data source
- **@Input() columns:  TableColumns[]** - Definitions of the columns and variables will be displayed
- **@Input() header: string[] -** Excel column header names (optional). If not set, columns display text will be set as a header.
- **@Input() name: string[] -** Exported file name
- **@Input() status: boolean -** The default value is true. If it set to false, excel export will not be triggered.
- **@Input() service: RequestOptions -** If set, the data will be requested from RESTful API address.
- **@Output() complete: Function -** It will be triggered when data received and before de export.

### Example Usage
````angular2html
<excel
(complete)="excelComplete()"
[data]="excelSample.data"
[columns]="excelSample.column"
[header]="excelSample.header"
[name]="excelSample.fileName"
>
</excel>
````
### Data Sample
````typescript
const excelSample = {
  fileName: 'ExcelFile',
  header: ['CODE', 'ADDRESS', 'NAME', 'SURNAME'],
  column: [
    {
      display: 'ID',
      variable: 'id',
      hidden: true
    },
    {
      display: 'Code',
      variable: 'code',
    },
    {
      display: 'Address',
      variable: 'recipient.address',
    },
    {
      display: 'Name',
      variable: 'user.name',
    },
    {
      display: 'Surname',
      variable: 'user.surname',
    }
  ],
  data: [
    {id: 1, code: 123213, recipient: {address: 'Doğruluk sok. 8/10 Ankara'}, user: {name: 'Serkan', surname: 'Konakcı'}},
    {id: 2, code: 2134, recipient: {address: 'Ateş sok. 3/5 İstanbul'}, user: {name: 'Seda', surname: 'Sayan'}},
    {id: 3, code: 456456, recipient: {address: 'Kıvılcım apt. 5/23 Konya'}, user: {name: 'Banu', surname: 'Alkan'}},
  ]
};
````
