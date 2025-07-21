import * as React from "react";
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import axios from "axios";
import { FaStreetView } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiSearch, BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { Breadcrumb, Col, Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// import 'react-datepicker/dist/react-datepicker.css';



let BaseUrl = process.env.REACT_APP_BASEURL



function Row({ row, setArchitecture, startDate, endDate, selectedFilter }) {
    const [open, setOpen] = React.useState(false);//open dropdown of connected quotation
    const [selectedArchitectureId, setSelectedArchitectureId] =
        React.useState(null);//set the architecture Id to delete
    const [showDeleteConfirmation, setShowDeleteConfirmation] =
        React.useState(false);//set the confirmation of delete
    const [selectedArchitecDetails, setselectedArchitecDetails] =
        React.useState(null);//to show data of architec
    const [Quotation, setQuotation] = React.useState([]);//in dropdown show data of Quotation
    const [selectedQuotationDetails, setselectedQuotationDetails] =
        React.useState(null);//show the Quotation data in model


    const handleviewQutotation = async (id) => {
        try {
            const saved = localStorage.getItem(process.env.REACT_APP_KEY);



            const response1 = await axios.get(`${BaseUrl}/quotation/viewdata/${id}`, {
                headers: {
                    Authorization: `Bearer ${saved}`,
                },
            });

            const QuotationData = response1.data.data1;
            console.log(QuotationData);

            const response2 = await axios.get(`${BaseUrl}/total/view/${id}`, {
                headers: {
                    Authorization: `Bearer ${saved}`,
                },
            });

            let tableData = response2.data.data;
            let mainTotal = 0;

            for (const item of tableData) {
                mainTotal += item.total;
            }

            const salesName = QuotationData.sales ? QuotationData.sales.Name : "";

            if (!Array.isArray(tableData)) {
                tableData = [tableData];
            }

            console.log("tabledataa", tableData);
            let architecNames = "";
            let carpenterNames = "";
            let shopNames = "";

            if (QuotationData.architec) {
                architecNames = QuotationData.architec
                    .map((architec) => architec.architecsName)
                    .join(", ");
            }
            if (QuotationData.carpenter) {
                carpenterNames = QuotationData.carpenter
                    .map((carpenter) => carpenter.carpentersName)
                    .join(", ");
            }
            if (QuotationData.shop) {
                shopNames = QuotationData.shop.map((shop) => shop.shopName).join(", ");
            }

            const innerTableRows = tableData.map((item, index) => (
                <tr key={index}>
                    <td className="break-words border">{item.description}</td>
                    <td className="break-words border">{item.area}</td>
                    <td className="border ">{item.size}</td>
                    <td className="border ">{item.rate}</td>
                    <td className="border ">{item.quantity}</td>
                    <td className="border ">{item.total}</td>
                </tr>
            ));

            setselectedQuotationDetails({
                tokenNo: QuotationData.serialNumber,
                Date: QuotationData.Date,
                name: QuotationData.userName,
                mobileNo: QuotationData.mobileNo,
                address: QuotationData.address,
                innerTable: innerTableRows,
                mainTotal: mainTotal,
                architec: architecNames,
                carpenter: carpenterNames,
                shop: shopNames,
                sales: salesName,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleviewdata = async (id) => {
        try {
            const saved = localStorage.getItem(process.env.REACT_APP_KEY);
            const response = await axios.get(`${BaseUrl}/architec/viewdata/${id}`, {
                headers: {
                    Authorization: `Bearer ${saved}`,
                },
            });

            console.log(response.data.data);
            setselectedArchitecDetails(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async () => {
        try {
            const saved = localStorage.getItem(process.env.REACT_APP_KEY);
            const response = await axios.delete(
                `${BaseUrl}/architec/data/delete/${selectedArchitectureId}`,
                {
                    headers: {
                        Authorization: `Bearer ${saved}`,
                    },
                }
            );

            console.log(response.data.data);
            setArchitecture((prevArchitecture) =>
                prevArchitecture.filter(
                    (architec) => architec._id !== selectedArchitectureId
                )
            );
            setShowDeleteConfirmation(false);
        } catch (error) {
            console.log(error);
        }
    };


    const confirmDelete = (id) => {
        setSelectedArchitectureId(id);
        setShowDeleteConfirmation(true);
    };
    const handleSubmit = async (id) => {
        try {
            const query = [];

            if (selectedFilter) {
                query.push(`status=${selectedFilter}`);
            }
            if (startDate) {
                query.push(`startDate=${new Date(startDate).toISOString()}`);
            }
            if (endDate) {
                query.push(`endDate=${new Date(endDate).toISOString()}`);
            }

            console.log("startDate ", startDate)
            console.log("endDate ", endDate)

            const queryString = query.length ? `?${query.join("&")}` : "";
            const saved = localStorage.getItem(process.env.REACT_APP_KEY);


            const response = await axios.get(`${BaseUrl}/architec/listdata/${id}${queryString}`, {

                headers: {
                    Authorization: `Bearer ${saved}`,
                },
            });

            setQuotation({ Quotation: response.data.data });
            console.log({ Quotation: response.data.data });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <React.Fragment>
                <TableRow style={{ borderBottom: '3px solid rgba(224, 224, 224, 1)' }}>
                    <TableCell onClick={() => handleSubmit(row._id)}>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row" class='color uppercase'>
                        {row.architecsName}
                    </TableCell>
                    <TableCell align="center">
                        <FaStreetView
                            className="mx-auto color"
                            onClick={() => handleviewdata(row._id)}
                        />
                    </TableCell>
                    <TableCell align="right">
                        <MdDeleteForever
                            className="mx-auto color"
                            onClick={() => confirmDelete(row._id)}
                        />
                    </TableCell>
                    <TableCell align="right">
                        <Link to={`${routeUrls.ARCHITECTURE}/${row._id}`}>
                            <BiEdit className="mx-auto color" />
                        </Link>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" className="color" gutterBottom component="div">
                                    Quotation :
                                    <span style={{ fontWeight: "normal" }}> {Quotation.Quotation?.length}</span>
                                </Typography>
                                <div>
                                    <Table size="small" aria-label="purchases">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" class='color-1'>Token Number</TableCell>
                                                <TableCell align="center" class='color-1'>Name</TableCell>
                                                <TableCell align="center" class='color-1'>Mobile No.</TableCell>
                                                <TableCell align="center" class='color-1'>Address</TableCell>
                                                <TableCell align="center" class='color-1'>Status</TableCell>
                                                <TableCell align="center" class='color-1'>Detalis</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Quotation.Quotation?.map((QuotationRow) => (
                                                <TableRow key={QuotationRow._id}>
                                                    <TableCell
                                                        class="color-1"
                                                        align="center"
                                                        style={{ wordBreak: "break-word", width: "15%" }}
                                                    >
                                                        {QuotationRow.serialNumber}
                                                    </TableCell>
                                                    <TableCell
                                                        scope="row"
                                                        align="center"
                                                        class="color-1"
                                                        style={{ width: "15%", textTransform: "uppercase" }}
                                                    >
                                                        {QuotationRow.userName}
                                                    </TableCell>
                                                    <TableCell align="center" style={{ width: "15%" }}>
                                                        {QuotationRow.mobileNo}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        class="color-1"
                                                        style={{ wordBreak: "break-word", width: "15%" }}
                                                    >
                                                        {QuotationRow.address}
                                                    </TableCell>
                                                    <TableCell
                                                        align="center"
                                                        class="color-1"
                                                        style={{ wordBreak: "break-word", width: "15%" }}
                                                    >
                                                        {QuotationRow.status}
                                                    </TableCell>
                                                    <TableCell align="center" style={{ wordBreak: "break-word", width: '15%' }}>
                                                        <FaStreetView
                                                            align="center"
                                                            className="fs-5 mx-auto color"
                                                            onClick={() => handleviewQutotation(QuotationRow._id)} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
            <Modal
                show={showDeleteConfirmation}
                onHide={() => setShowDeleteConfirmation(false)}
            >
                <div className="logout-model">
                    <div className="logout">
                        <p>Are you sure you want to delete this item?</p>
                        <div className="modal-buttons">
                            <button
                                className=" rounded-full n-color"
                                onClick={() => setShowDeleteConfirmation(false)}
                            >
                                No
                            </button>
                            <button className=" rounded-full n-color" onClick={handleDelete}>
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                show={selectedArchitecDetails !== null}
                onHide={() => setselectedArchitecDetails(null)}
            >
                <Modal.Body className="bg-white rounded">
                    {selectedArchitecDetails !== null && (
                        <div className="pl-10 md:pl-24 ">
                            <table className="w-full table-fixed ">
                                <tr>
                                    <th className="py-2 color">Architecture Name</th>
                                    <td> {selectedArchitecDetails.architecsName}</td>
                                </tr>
                                <tr>
                                    <th className="py-2 color">Mobile No</th>
                                    <td> {selectedArchitecDetails.mobileNo}</td>
                                </tr>
                                <tr>
                                    <th className="py-2 color">Address</th>
                                    <td className="break-words">
                                        {selectedArchitecDetails.address}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    )}
                    <div className="flex justify-center mt-2">
                        <div
                            className="btn n-color text-white rounded-full py-2 px-4 mt-2 "
                            onClick={() => setselectedArchitecDetails(null)}
                        >
                            Close
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={selectedQuotationDetails !== null}
                onHide={() => setselectedQuotationDetails(null)}
            >
                <Modal.Body className="bg-white rounded">
                    {selectedQuotationDetails !== null && (
                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                                <tbody>
                                    <tr>
                                        <th className="m-table color table-width">Token No</th>
                                        <td className="m-table"><b style={{ paddingRight: '20px' }}>:</b>{selectedQuotationDetails.tokenNo}</td>
                                    </tr>
                                    <tr>
                                        <th className="m-table color table-width">Date</th>
                                        <td className="m-table"><b style={{ paddingRight: '20px' }}>:</b>{selectedQuotationDetails.Date}</td>
                                    </tr>
                                    <tr>
                                        <th className="m-table color table-width">Name </th>
                                        <td className="m-table break-words uppercase"><b style={{ paddingRight: '20px' }}>:</b>
                                            {selectedQuotationDetails.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="m-table color table-width">Mobile No</th>
                                        <td className="m-table"><b style={{ paddingRight: '20px' }}>:</b>{selectedQuotationDetails.mobileNo}</td>
                                    </tr>
                                    <tr>
                                        <th className="m-table color table-width">Address</th>
                                        <td className="m-table break-words"><b style={{ paddingRight: '20px' }}>:</b>
                                            {selectedQuotationDetails.address}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="m-table color table-width">Architec</th>
                                        <td className="m-table"><b style={{ paddingRight: '20px' }}>:</b>{selectedQuotationDetails.architec}</td>
                                    </tr>
                                    <tr>
                                        <th className="m-table color table-width">Carpenter</th>
                                        <td className="m-table"><b style={{ paddingRight: '20px' }}>:</b>{selectedQuotationDetails.carpenter}</td>
                                    </tr>
                                    <tr>
                                        <th className="m-table color table-width">shop</th>
                                        <td className="m-table"><b style={{ paddingRight: '20px' }}>:</b>{selectedQuotationDetails.shop}</td>
                                    </tr>
                                    <tr>
                                        <th className="m-table color table-width">Sales Person</th>
                                        <td className="m-table"><b style={{ paddingRight: '20px' }}>:</b>{selectedQuotationDetails.sales}</td>
                                    </tr>
                                    <tr className=" text-center">
                                        <table className="table-container border border-separate my-3">
                                            <thead>
                                                <tr>
                                                    <th className="border color">Description</th>
                                                    <th className="border color ">Area</th>
                                                    <th className="border color ">Size</th>
                                                    <th className="border color ">Rate</th>
                                                    <th className="border color ">Quantity</th>
                                                    <th className="border color ">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>{selectedQuotationDetails.innerTable}</tbody>
                                            <tr className="text-right color">
                                                <th colSpan="5">Main Total:</th>
                                                <td className="border">{selectedQuotationDetails.mainTotal}</td>
                                            </tr>
                                        </table>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="flex justify-center mt-2">
                        <div
                            className="btn n-color text-white rounded-full py-2 px-4 mt-2"
                            onClick={() => setselectedQuotationDetails(null)}
                        >
                            Close
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default function Architecturelist() {
    const [architecture, setArchitecture] = React.useState([]);//to show architec data
    const [isLoading, setIsLoading] = React.useState(true);//set the loader when api get the data
    const [currentPage, setCurrentPage] = React.useState(1);//set the page in pagination
    const itemsPerPage = 10;

    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [selectedFilter, setSelectedFilter] = React.useState('');
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("📦 Fetching architecture list...");

                const saved = localStorage.getItem(process.env.REACT_APP_KEY);

                const params = new URLSearchParams();

                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                if (selectedFilter) params.append('filter', selectedFilter);

                let response;

                if ((startDate && endDate) || selectedFilter) {
                    // setIsLoading(true);
                    response = await axios.get(`${BaseUrl}/architec/list?${params.toString()}`, {
                        headers: {
                            Authorization: `Bearer ${saved}`,
                        },
                    });
                } else {
                    // setIsLoading(true);
                    response = await axios.get(`${BaseUrl}/architec/list`, {
                        headers: {
                            Authorization: `Bearer ${saved}`,
                        },
                    });
                }

                setArchitecture(response.data.data);
            } catch (error) {
                console.error("❌ Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate, selectedFilter]); // ✅ Fixed


    const totalPages = Math.ceil(architecture.length / itemsPerPage);
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = architecture.slice(startIndex, endIndex);

    const handleSearch = async (architecName) => {
        try {
            setCurrentPage(1);
            const saved = localStorage.getItem(process.env.REACT_APP_KEY);
            const url = `${BaseUrl}/architec/searchdata?architecName=${architecName}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${saved}`,
                },
            });

            console.log(response.data.data);
            setArchitecture(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        if (!newStartDate) {
            setStartDate("");
        }
    };

    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
        if (!newEndDate) {
            setEndDate("");
        }
    };


    if (isLoading) {
        return <div className="d-flex justify-content-center align-items-center vh-100">
            <h1 className="color font-bold text-4xl">
                TIMBERLAND
            </h1>
        </div>;
    }
    return (
        <>
            <div className="n-color text-white rounded-br-full">
                <div className="row mb-3 py-3 lg:mx-0 ms-12">
                    <Col md={6} sm={12}>
                        <p className="md:text-2xl text-xl font-bold pl-9">TIMBERLAND</p>
                    </Col>
                    <Col md={6} sm={12} className="lg:pl-40">
                        <div className="relative ">
                            <input
                                type="search"
                                className="search-input py-1 pr-2 ps-10 md:w-80 w-40 rounded-md	text-black"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <div className="absolute fs-5 bottom-1 left-2 text-black">
                                <BiSearch />
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
            <div className="md:ps-24 ps-10">
                <Breadcrumb className="font-bold color">
                    <Breadcrumb.Item
                        linkAs={Link}
                        linkProps={{ to: routeUrls.DASHBOARD }}
                    >
                        Dashboard
                    </Breadcrumb.Item>
                    <Breadcrumb.Item
                        linkAs={Link}
                        linkProps={{ to: routeUrls.ARCHITECTURELIST }}
                    >
                        Architecture List
                    </Breadcrumb.Item>

                    <Col xs={120} md={4} lg={6} className="flex items-center px-0">
                        <p className="leading-normal color">From</p>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            className="border-solid border-2 border-[#49413C] rounded px-1 mx-2"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <p className="color">To</p>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            className="border-solid border-2 border-[#49413C] rounded px-1 mx-2"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />


                        <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
                            <option value="">Filter By</option>
                            <option value="Approve">Approve</option>
                            <option value="Reject">Reject</option>
                            <option value="followup">followup</option>
                            <option value="None">None</option>
                        </select>
                    </Col>
                </Breadcrumb>


            </div>
            <div className="container my-5 table-auto">
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)' }}>
                            <TableRow>
                                <TableCell />
                                <TableCell class="color">Architecture Name</TableCell>
                                <TableCell class="color-1" align="center" className="font-bold">
                                    Detalis
                                </TableCell>
                                <TableCell class="color-1" align="center">Delete</TableCell>
                                <TableCell class="color-1" align="center">Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {itemsToDisplay.map((row) =>
                                row && row.architecsName ? (
                                    <Row key={row._id} row={row} setArchitecture={setArchitecture} followDetails={row.followDetails} startDate={startDate} endDate={endDate} selectedFilter={selectedFilter} />
                                ) : null
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="d-flex justify-center my-3">
                <Stack spacing={2}>
                    <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} variant="outlined" />
                </Stack>
            </div>
        </>
    );
}
