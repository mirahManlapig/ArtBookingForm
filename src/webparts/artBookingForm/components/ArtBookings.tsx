import * as React from "react";
import { useState, useEffect } from "react";
import { useBoolean } from "@uifabric/react-hooks";
import {
  getTheme,
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  Modal,
  IconButton,
  IIconProps,
  CommandBarButton,
  TooltipHost,
  ITooltipHostStyles,
  Stack,
  IStackStyles,
  mergeStyleSets,
  IColumn
} from "office-ui-fabric-react/lib/";
import { ArtBookingForm } from "./ArtBookingForm";
import * as App from "./ArtBookingFormApp";
import styles from "./ArtBookingForm.module.scss";

export const Bookings = ({
  updateNewBooking, ...props
}) => {
  const [msg, setMsg] = useState("");
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const [selectedItem, setSelectedItem] = useState<Object | undefined>(
    undefined
  );
  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedItem(selection.getSelection());
    },
  });
  


  const theme = getTheme();

  const contentStyles = mergeStyleSets({
    container: {
      display: 'flex',
    },
    body: {
      overflowY: 'hidden'
    }
  });

  const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: "auto",
      marginTop: "4px",
      marginRight: "2px",
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };
  const columns = [
    {
      key: "column2",
      name: "Full Name",
      fieldName: "FullName",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "column3",
      name: "Division",
      fieldName: "Division",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "column4",
      name: "Date of Return To Office",
      fieldName: "DORTO",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "column5",
      name: "Test Date",
      fieldName: "TestDate",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "column6",
      name: "Test Result",
      fieldName: "TestResult",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
  ];

  
  const stackStyles: Partial<IStackStyles> = { root: { height: 44 } };
  useEffect(() => {
    if (props.status == "loading") {
      setMsg("Loading...");
    } else if (props.bookings.length == 0) {
      setMsg("No Existing ART Submissions.");
    }
  }, [selectedItem]);
  const addIcon: IIconProps = { iconName: "Add" };
  const cancelIcon: IIconProps = { iconName: "Cancel" };
  const calloutProps = { gapSpace: 0 };
  const hostStyles: Partial<ITooltipHostStyles> = {
    root: { display: "inline-block" },
  };
  
  return (
    <div>
      <Stack horizontal styles={stackStyles}>
        <CommandBarButton
          iconProps={addIcon}
          styles={stackStyles}
          text="New"
          onClick={showModal}
        />
      </Stack>
      {props.bookings.length == 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#C2C9D6",
            fontSize: "x-large",
          }}
        >
          {msg}
        </div>
      )}
      {props.bookings.length != 0 && (
        <DetailsList
          items={props.bookings}
          compact={false}
          columns={columns}
          selectionMode={SelectionMode.single}
          setKey="single"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          selection={selection}
          selectionPreservedOnEmptyClick={true}
          enterModalSelectionOnTouch={true}
        />
      )}
      {props.isFormAvailable && (
        <Modal isOpen={isModalOpen} onDismiss={hideModal} isBlocking={false} containerClassName={contentStyles.container}>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
          <ArtBookingForm
            updateNewBooking={updateNewBooking}
            hideModal={hideModal}
            listName={props.listName}
          />
        </Modal>
      )}
    </div>
  );
};
