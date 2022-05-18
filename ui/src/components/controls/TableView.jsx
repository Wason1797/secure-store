import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "../text/Title";

const TableView = (props) => {
  const titleRow = props?.tableTitles.map((title, index) => (
    <TableCell key={`${index}-${title.text}`} align={title.align || "center"}>
      {title.text}
    </TableCell>
  ));

  const contentRows = props?.tableContent.map((row, rowIndex) => (
    <TableRow key={`row-${rowIndex}`}>
      {props?.tableTitles.map((title, cellIndex) => (
        <TableCell
          key={`${rowIndex}-${cellIndex}-cell-${title.mapping}`}
          align={row[title.mapping]?.align || "center"}
          style={{
            whiteSpace: "normal",
            wordWrap: "anywhere",
          }}
        >
          {title?.obfuscated ? "******" : row[title.mapping]}
        </TableCell>
      ))}
    </TableRow>
  ));

  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>{titleRow}</TableRow>
        </TableHead>
        <TableBody>{contentRows}</TableBody>
      </Table>
      {props.showLink && (
        <Link color="primary" href={props.linkHref || "#"} onClick={props.onLinkClick} sx={{ mt: 3 }}>
          {props.linkText}
        </Link>
      )}
    </React.Fragment>
  );
};

export default TableView;
