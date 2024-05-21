// ReportData.ts

export interface Report {
    name: string;
    date: Date;
    creator: string;
    type: string;
}

// Function to generate a random date within the last two months
const getRandomDateLastTwoMonths = (): Date => {
    const today = new Date();
    const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
    const randomTime = twoMonthsAgo.getTime() + Math.random() * (today.getTime() - twoMonthsAgo.getTime());
    return new Date(randomTime);
};

// Array of report data with random dates from the last two months
const reports: Report[] = [
    {
        name: "Report_1",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Quick Report",
    },
    {
        name: "Report_2",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Custom Report",
    },
    {
        name: "Report_3",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Full Report",
    },
    {
        name: "Report_4",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Custom Report",
    },
    {
        name: "Report_5",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Quick Report",
    },
    {
        name: "Report_6",
        date: getRandomDateLastTwoMonths(),
        creator: "admin",
        type: "Full Report",
    },
];

export default reports;
