export interface Cell {
  Value: string;
  Attributes?: { Value: string; Id: string }[];
}

export interface Row {
  RowType: string;
  Title?: string;
  Cells?: Cell[];
  Rows?: Row[];
}

export interface Report {
  ReportID: string;
  ReportName: string;
  ReportType: string;
  ReportTitles: string[];
  ReportDate: string;
  UpdatedDateUTC: string;
  Fields: any[];
  Rows: Row[];
}

export interface BalanceSheetReport {
  Status: string;
  Reports: Report[];
}