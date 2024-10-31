import React, {useEffect, useState} from "react";
import {FlatList, ScrollView, View} from "react-native";
import {NavigationProp, ParamListBase} from "@react-navigation/native";
import {strings} from "../../localisation/Strings";
import DefaultScreenContainer from "./containers/DefaultScreenContainer";
import LeafText from "../base/LeafText/LeafText";
import VStack from "../containers/VStack";
import VGap from "../containers/layout/VGap";
import HStack from "../containers/HStack";
import LeafButton from "../base/LeafButton/LeafButton";
import {LeafButtonType} from "../base/LeafButton/LeafButtonType";
import LeafColors from "../styling/LeafColors";
import LeafDimensions from "../styling/LeafDimensions";
import LeafTypography from "../styling/LeafTypography";
import {useNotificationSession} from "../base/LeafDropNotification/NotificationSession";
import ExportReportCard from "../custom/ExportReportCard";
import FormHeader from "../custom/FormHeader";
import axios from 'axios';
import Session from "../../model/session/Session";
import StateManager from "../../state/publishers/StateManager";
import File from "../../model/file/File";
import LeafDateInput from "../base/LeafDateInput/LeafDateInput";
import LeafReportSearchBar from "../base/LeafSearchBar/LeafReportSearchBar";

// Define the props interface for the FileHistoryScreen component
interface Props {
    navigation?: NavigationProp<ParamListBase>;
}

// Main component for displaying file history and exporting reports
const FileHistoryScreen: React.FC<Props> = ({navigation}) => {
    // State to hold the currently selected report
    const [selectedReport, setSelectedReport] = useState<File | null>(null);
    // State to manage notification trigger
    const [notify, setNotify] = useState(false);
    // Access notification functions to display error, success, and default notifications
    const {showErrorNotification, showSuccessNotification, showDefaultNotification} = useNotificationSession();
    // State to store all files fetched from the session
    const [files, setFiles] = useState<File[]>([]);

    // Filter states
    const [titleFilter, setTitleFilter] = useState<string>("");
    const [fromDateFilter, setFromDateFilter] = useState<Date | undefined>();
    const [toDateFilter, setToDateFilter] = useState<Date | undefined>(new Date());
    const [dateError, setDateError] = useState<string | null>(null);

    // useEffect hook to fetch files and subscribe to file updates
    useEffect(() => {
        const unsubscribeFiles = StateManager.filesFetched.subscribe(() => {
            setFiles(Session.inst.getAllFiles());
        });

        // Fetch files initially when the component mounts
        Session.inst.fetchAllFiles();

        // Cleanup subscription on component unmount
        return () => {
            unsubscribeFiles();
        };
    }, []);

    // Function to toggle the selection of a report
    const toggleReportSelect = (report: File) => {
        setNotify(false);
        // Deselect the report if it's already selected
        if (selectedReport && selectedReport.title === report.title) {
            setSelectedReport(null);
        } else {
            setSelectedReport(report);
        }
    };

    // Function to handle exporting the selected report
    const exportReport = async () => {
        // Show loading notification while the report is being downloaded
        showDefaultNotification(strings("label.pleaseWait"), strings("label.downloadingFile"), 'progress-download');
        if (selectedReport) {
            // Convert the report's created date to a sanitized string
            const dateString = selectedReport.created.toLocaleString();
            const regex = /[,\s:\/]/g;
            const sanitizedDateString = dateString.replace(regex, "_");

            const file_id: string = selectedReport.id;
            const title: string = selectedReport.title;
            const download_title: string = selectedReport.title + ' (' + sanitizedDateString + ')';
            const password: string = selectedReport.password;
            const report_type: string = selectedReport.reportType;

            try {
                // Make an API call to download the report
                const response = await axios.get('http://127.0.0.1:5000/download', {
                    params: {file_id: file_id, file_title: title, password: password, report_type: report_type},
                    responseType: 'blob',
                });

                // Create a URL for the downloaded file and trigger the download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = `${download_title}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                // Show success notification after the file is downloaded
                showSuccessNotification(strings("feedback.successDownloadReport"));
            } catch (error) {
                // Show error notification if the file download fails
                console.error('Error downloading the file', error);
                showErrorNotification(strings("feedback.failDownloadReport"));
            }
        } else {
            // Show error notification if no report is selected
            setNotify(true);
            showErrorNotification(strings("label.noReportSelected"));
        }
    };

    // Define the interface for grouped reports by month and year
    interface GroupedReports {
        monthYear: string;
        reports: File[];
    }

    // Function to group reports by month and year
    const groupReportsByMonth = (reports: File[]): GroupedReports[] => {
        const groupedReports: GroupedReports[] = [];
        reports
            .slice()
            .sort((a, b) => b.created.getTime() - a.created.getTime()) // Sort reports by creation date in descending order
            .forEach(report => {
                const monthYear = report.created.toLocaleString('default', {month: 'long', year: 'numeric'});
                const existingGroupIndex = groupedReports.findIndex(group => group.monthYear === monthYear);
                // If a group for the same month and year exists, add the report to that group
                if (existingGroupIndex !== -1) {
                    groupedReports[existingGroupIndex].reports.push(report);
                } else {
                    // Otherwise, create a new group
                    groupedReports.push({monthYear: monthYear, reports: [report]});
                }
            });
        return groupedReports;
    };

    // Function to apply filters to the list of reports based on title and date range
    const applyFilters = (reports: File[]): File[] => {
        if (dateError) {
            return [];
        }
        return reports.filter(report => {
            const matchesTitle = titleFilter === "" || report.title.toLowerCase().includes(titleFilter.toLowerCase());
            const matchesFromDate = !fromDateFilter || report.created >= fromDateFilter;
            const matchesToDate = !toDateFilter || report.created <= toDateFilter;
            return matchesTitle && matchesFromDate && matchesToDate;
        });
    };

    // useEffect hook to validate the date filters and set an error message if necessary
    useEffect(() => {
        if (fromDateFilter && toDateFilter && fromDateFilter > toDateFilter) {
            setDateError("From date cannot be after the To date.");
        } else {
            setDateError(null);
        }
    }, [fromDateFilter, toDateFilter]);

    // Apply filters to the files and group the filtered reports by month
    const filteredReports = applyFilters(files);
    const groupedReports = groupReportsByMonth(filteredReports);

    // JSX for rendering the UI components
    return (
        <DefaultScreenContainer>
            <VStack spacing={16}>
                {/* Button to trigger the report download */}
                <LeafButton
                    label="Download"
                    icon="file-download"
                    typography={LeafTypography.button}
                    type={LeafButtonType.Filled}
                    color={LeafColors.accent}
                    onPress={async () => {
                        exportReport();
                        console.log("Downloading report: ", selectedReport);
                    }}
                />
                {/* Filters */}
                <HStack spacing={8} style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                    <View style={{flex: 3}}>
                        <LeafReportSearchBar
                            label={strings("search.underlying")}
                            onTextChange={setTitleFilter}
                            data={[]}
                            setData={() => {
                            }}
                            dataToString={(item) => item}
                            style={{flex: 3}}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <LeafDateInput
                            label={strings("label.fromDate")}
                            onChange={(date) => {
                                setFromDateFilter(date);
                            }}
                        />
                    </View>
                    <View style={{flex: 1, minWidth: '150px'}}>
                        <LeafDateInput
                            label={strings("label.toDate")}
                            initialValue={new Date()}
                            onChange={(date) => {
                                setToDateFilter(date);
                            }}
                        />
                    </View>
                </HStack>
                <HStack
                    spacing={16}
                    style={{
                        alignItems: "center",
                    }}
                >
                    <LeafText
                        typography={LeafTypography.body.withColor(LeafColors.textSemiDark)}
                        style={{
                            flex: 1,
                            color: notify ? LeafColors.textError.getColor() : LeafColors.accent.getColor(),
                        }}
                    >
                        {selectedReport === null
                            ? strings("label.noReportSelected")
                            : selectedReport.title + strings("label.reportSelected")}
                    </LeafText>
                </HStack>
            </VStack>

            <VGap size={12}/>
            <VStack>
                {/* Scrollable list of grouped reports */}
                <ScrollView style={{flex: 1, width: "100%"}}>
                    {groupedReports.map((group, index) => (
                        <VStack key={index}>
                            <FormHeader title={group.monthYear}/>
                            <FlatList
                                data={group.reports}
                                renderItem={({item: report}) => (
                                    <ExportReportCard
                                        report={report}
                                        isSelected={selectedReport?.title === report.title}
                                        onPress={() => toggleReportSelect(report)}
                                    />
                                )}
                                keyExtractor={(report) => report.id}
                                ItemSeparatorComponent={() => <VGap size={LeafDimensions.cardSpacing}/>}
                                scrollEnabled={false}
                                style={{
                                    width: "100%",
                                    overflow: "visible",
                                    flexGrow: 0,
                                }}
                            />
                        </VStack>
                    ))}
                </ScrollView>
            </VStack>
        </DefaultScreenContainer>
    );
};

export default FileHistoryScreen;
