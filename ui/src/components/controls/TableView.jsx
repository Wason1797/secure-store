import * as React from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import Toolbar from "@mui/material/Toolbar";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import IconButton from "@mui/material/IconButton";

import Title from "../text/Title";
import IconMapping from "../mappings/iconMappings";

const toIconButton = ({ index, icon, ariaLabel, disabled, onClick, size = "large", color = "inherit" }) => {
  const Icon = IconMapping[icon];
  return (
    <IconButton
      size={size}
      aria-label={ariaLabel}
      color={color}
      onClick={onClick}
      key={`tableViewIcon-${index}`}
      disabled={disabled}
    >
      <Icon />
    </IconButton>
  );
};

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
      <Toolbar disableGutters variant="dense">
        <Title>{props.title}</Title>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex" }}>
          {props?.toolbarButtons?.map((button, index) => toIconButton({ index, ...button }))}
        </Box>
      </Toolbar>
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
