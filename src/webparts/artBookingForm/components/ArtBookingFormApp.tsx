import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { differenceInDays, parseISO, addDays } from "date-fns";

export const validateForm = (fullName, division, DORTO, TestDate, TestResult) => {
    if (!fullName || !division || !DORTO || !TestDate || !TestResult) {
        return false;
    } else {
        return true;
    }
};

export const getBookings = async (listName) => {
    let user = await sp.web.currentUser();
    const allItems: any[] = await sp.web.lists
        .getByTitle(listName)
        .items.select("FullName", "Division", "DORTO", "TestDate", "TestResult")
        .filter("AuthorId eq '" + user.Id + "'")
        .getAll();
    return formatBooking(allItems);
};


const setGbtbFormProps = (props) => {
    let _spForm = {
        Title: "ART Booking",
        FullName: props.fullName,
        Division: props.division,
        DORTO: props.DORTO,
        TestDate: props.TestDate,
        TestResult: props.TestResult,
    };
    return _spForm;
}

export const addItem = async (listName, data) => {
    let _gbtbFormProps = setGbtbFormProps(data);
    const iar: IItemAddResult = await sp.web.lists
        .getByTitle(listName)
        .items.add(_gbtbFormProps);
    return iar;
};

export const getList = async (listName) => {
    let allItems: any[] = await sp.web.lists.getByTitle(listName).items.get();
    return allItems;
};

const formatBooking = (bookings) => {
    var result = [];
    for (let i = 0; i < bookings.length; i++) {
        if (bookings[i]) {
            const ParsedDORTO = parseISO(bookings[i].DORTO).toLocaleDateString();
            const ParsedTestDate = parseISO(bookings[i].TestDate).toLocaleDateString();
            result.push({
                key: bookings[i].ID,
                FullName: bookings[i].FullName,
                Division: bookings[i].Division,
                TestResult: bookings[i].TestResult,
                TestDate: ParsedTestDate,
                DORTO: ParsedDORTO,
                DORTOdate: bookings[i].DORTO,
            });
        }
    }
    return result;
};

export const formatDropList = (data) => {
    var listItems = [];
    for (var k in data) {
        listItems.push({ key: k, text: data[k].Title });
    }
    return listItems;
};

