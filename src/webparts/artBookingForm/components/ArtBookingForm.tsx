import * as React from 'react';
import { useState, useEffect } from "react";
import styles from './ArtBookingForm.module.scss';
import { IArtBookingFormProps } from './IArtBookingFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as App from "./ArtBookingFormApp";
import {
  Dropdown,
  IDropdownStyles,
  TextField,
  PrimaryButton,
  Checkbox
} from "office-ui-fabric-react/lib";
import { Calendar } from "office-ui-fabric-react/lib/Calendar";
import { Label } from "office-ui-fabric-react/lib/Label";
import { sp } from "@pnp/sp";

const DayPickerStrings = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],

  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],

  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],

  shortDays: ["S", "M", "T", "W", "T", "F", "S"],

  goToToday: "Go to today",
  weekNumberFormatString: "Week number {0}",
};



export const ArtBookingForm = (props) => {
  const [status, setStatus] = useState("ready");
  const [fullName, setFullName] = useState("");
  const [division, setDivision] = useState(null);
  const [divisionList, setDivisionList] = useState([]);
  const [DORTO, setDORTO] = useState(new Date());
  const [TestDate, setTestDate] = useState(new Date());
  const [TestResult, setTestResult] = useState(null);
  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdownItemsWrapper: { maxHeight: "300px" },
  };
  const [errMsg, setErrMsg] = useState("");
  const _setDORTO = async (selectedDate) => {
    setDORTO(selectedDate);
  };
  const _setTestDate = async (selectedDate) => {
    setTestDate(selectedDate);
  };
  const resetForm = () => {
    props.updateNewBooking();
    setFullName("");
    setDivision(null);
    setDORTO(new Date());
    setTestDate(new Date());
    setTestResult(null);
  };
  const submitForm = () => {
    var data = {
      fullName: fullName,
      division: divisionList[division].text,
      DORTO: DORTO,
      TestDate: TestDate,
      TestResult: TestResult,
    };
    App.addItem(props.listName, data).then(
      (value) => {
        alert("Form submitted successfully!");
        props.hideModal();
        resetForm();
      },
      (reason) => {
        alert("Form submitted failed.");
      }
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus("loading");
        const divResult = await App.getList("Division");
        setDivisionList(App.formatDropList(divResult));
        setStatus("ready");
      } catch (e) {
        setStatus("error");
      }
    };
    fetchData();
  }, []);
  let myFormRef;

  return (
    <div className={styles.artBookingForm}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h2>ART Form</h2>
        </div>
        <form id="ARTForm" ref={(el) => (myFormRef = el)}>
          <div className={styles.item}>
            <TextField
              label="Full Name"
              value={fullName}
              required
              placeholder="Full Name"
              onChange={(e, newValue) => {
                setFullName(newValue);
              }}
            />
          </div>
          <div className={styles.item}>
            <label>
              <Dropdown
                label="Division"
                options={divisionList}
                selectedKey={division}
                placeholder="Select your division"
                onChange={(e, selectedOption) => {
                  setDivision(selectedOption.key);
                }}
                styles={dropdownStyles}
                required
              ></Dropdown>
            </label>
          </div>
          <div className={styles.item}>
            <label>
              <Label required>Date of Return to Office</Label>
              <div className={styles.errMsg}>{errMsg}</div>
              <Calendar
                onSelectDate={(selectedDate) => _setDORTO(selectedDate)}
                isMonthPickerVisible={true}
                showGoToToday={false}
                value={DORTO}
                strings={DayPickerStrings}
                highlightSelectedMonth={true}
              //restrictedDates={disableDate}
              />
            </label>
          </div>
          <div className={styles.item}>
            <label>
              <Label required>Test Date</Label>
              <div className={styles.errMsg}>{errMsg}</div>
              <Calendar
                onSelectDate={(selectedDate) => _setTestDate(selectedDate)}
                isMonthPickerVisible={true}
                showGoToToday={false}
                value={TestDate}
                strings={DayPickerStrings}
                highlightSelectedMonth={true}
                maxDate={new Date()}
              //restrictedDates={disableDate}
              />
            </label>
          </div>
          <div className={styles.item}>
            <label>
              <Dropdown
                label="Test Result"
                options={[
                  { key: 'Positive', text: 'Positive' },
                  { key: 'Negative', text: 'Negative' }
                ]}
                selectedKey={TestResult}
                placeholder="Select your test result"
                onChange={(e, selectedOption) => {
                  setTestResult(selectedOption.text);
                }}
                styles={dropdownStyles}
                required
              ></Dropdown>
            </label>
          </div>
          <div className={styles.item}>
            <p>
              <div className={styles.buttonItem}>
                <PrimaryButton
                  text="Submit"
                  type="button"
                  onClick={submitForm}
                  disabled={!App.validateForm(fullName, division, DORTO, TestDate, TestResult)}
                />
                <PrimaryButton text="Reset" type="reset" onClick={resetForm} />
              </div>
            </p>
          </div>
        </form>
      </div>
    </div>
  );

};
