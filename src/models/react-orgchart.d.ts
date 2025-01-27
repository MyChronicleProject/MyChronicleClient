declare module "@dabeng/react-orgchart" {
  import React from "react";

  interface OrgChartProps {
    datasource: any; // Zmień na bardziej precyzyjny typ, jeśli znasz strukturę danych
    chartClass?: string;
  }

  export default class OrgChart extends React.Component<OrgChartProps> {}
}
