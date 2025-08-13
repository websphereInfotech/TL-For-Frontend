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
import { Breadcrumb, Col, Container, Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";
import { AiOutlinePlus } from "react-icons/ai"
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { AiOutlineDownload } from "react-icons/ai"
import { saveAs } from 'file-saver';

let BaseUrl = process.env.REACT_APP_BASEURL

function Row(props) {
  const { row, setSalesperson, startDate, endDate } = props;//pass props for export salelist
  const [open, setOpen] = React.useState(false);//open dropdown of Quotation data
  const [salespersonID, setSalespersonId] = React.useState(null);//set salesperson id to delete data
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);//set confirmation for delete data
  const [selectedSalesperson, setSelectedSalesperson] = React.useState(null);//to show salesperson data in model
  const [datesSelected, setDatesSelected] = React.useState(false);//set the date which is
  const [Quotation, setQuotation] = React.useState([]);
  const [selectedQuotationDetails, setselectedQuotationDetails] =
    React.useState(null);
  const [userCount, setUserCount] = React.useState(null);

  const handleviewQutotation = async (id) => {
    try {
      const saved = localStorage.getItem(process.env.REACT_APP_KEY);
      const response = await axios.get(`${BaseUrl}/marketing/view/${id}`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      });

      const QuotationData = response.data?.data;

      setselectedQuotationDetails({
        name: QuotationData?.name,
        date: QuotationData?.date,
        mobileNo: QuotationData.mobileNo,
        address: QuotationData.address,
        addressTwo: QuotationData.addressTwo,
        nextEmergingDate: QuotationData.nextEmergingDate,
        remark: Quotation.remark
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleviewdata = async (id) => {
    try {
      const saved = localStorage.getItem(process.env.REACT_APP_KEY);
      const response = await axios.get(`${BaseUrl}/marketingPerson/view/${id}`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      });

      console.log(response.data.data);
      setSelectedSalesperson(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      const saved = localStorage.getItem(process.env.REACT_APP_KEY);
      const response = await axios.delete(`${BaseUrl}/salesPerson/delete/${salespersonID}`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      });

      console.log(response.data.data);

      setSalesperson((prevSalesperson) =>
        prevSalesperson.filter((salesperson) => salesperson._id !== salespersonID)
      );

      setShowDeleteConfirmation(false);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (id) => {
    setSalespersonId(id);
    setShowDeleteConfirmation(true);
  };

  const handleSubmit = async (id, startDate, endDate) => {
    try {
      const saved = localStorage.getItem(process.env.REACT_APP_KEY);
      let apiUrl = `${BaseUrl}/marketing/list/${id}?`;

      if (startDate && endDate) {
        apiUrl += `startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        setQuotation(response.data.data);
        setUserCount(response.data.data.length);
      } else {
        setQuotation([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if ((startDate && endDate)) {
      handleSubmit(row._id, startDate, endDate);
      setDatesSelected(true);
    } else {
      setDatesSelected(false);
    }
  }, [row._id, startDate, endDate, userCount]);

  const exportToExcel = async (id) => {
    try {
      const saved = localStorage.getItem(process.env.REACT_APP_KEY);
      let apiUrl = `${BaseUrl}/marketing/excel/${id}?`

      if (startDate && endDate) {
        apiUrl += `startDate=${startDate}&endDate=${endDate}`;
      }
      console.log("my url", apiUrl)
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, 'Marketing.xlsx');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <React.Fragment>

        <TableRow style={{ borderBottom: '3px solid rgba(224, 224, 224, 1)' }}>
          <TableCell onClick={() => handleSubmit(row._id, startDate, endDate)}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" class='color uppercase' >
            {row.login_id}
          </TableCell>
          <TableCell align="center">
            <AiOutlineDownload className="mx-auto color" onClick={() => exportToExcel(row._id)} />

          </TableCell>
          <TableCell align="center">
            <FaStreetView
              className="mx-auto color"
              onClick={() => handleviewdata(row._id)}
            />
          </TableCell>
          {/* <TableCell a
           */}
          {/* <TableCell align="right">
            <Link to={`${routeUrls.MRAKETINGFORM}/${row._id}`}>
              <BiEdit className="mx-auto color" />
            </Link>
          </TableCell> */}
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" className="color" gutterBottom component="div">
                  Data :
                  <span style={{ fontWeight: "normal" }}> {userCount}</span>
                </Typography>

                <div className="">
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" class='color-1'>Date</TableCell>
                        <TableCell align="center" class='color-1'>Name</TableCell>
                        <TableCell align="center" class='color-1'>Mobile No.</TableCell>
                        <TableCell align="center" class='color-1'>Address</TableCell>
                        <TableCell align="center" class='color-1'>Detalis</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Quotation?.map((Salerow) => (

                        <TableRow key={Salerow._id}>
                          <TableCell align="center"
                            style={{ width: '15%', textTransform: "uppercase" }}>
                            {Salerow.date ? new Date(Salerow.date).toLocaleDateString('en-GB') : ''}
                          </TableCell>
                          <TableCell align="center"
                            style={{ width: '15%', textTransform: "uppercase" }}>
                            {Salerow.name}
                          </TableCell>
                          <TableCell
                            align="center"
                            class='color-1'
                            style={{ wordBreak: "break-word", width: '15%' }}
                          >
                            {Salerow.mobileNo}
                          </TableCell>

                          <TableCell
                            align="center"
                            class='color-1'
                            style={{ wordBreak: "break-word", width: '15%' }}
                          >
                            {Salerow.address}
                          </TableCell>
                          <TableCell align="center" style={{ wordBreak: "break-word", width: '15%' }}>
                            <FaStreetView
                              align="center"
                              className="fs-5 mx-auto color"
                              onClick={() => handleviewQutotation(Salerow._id)} />
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
        show={selectedSalesperson !== null}
        onHide={() => setSelectedSalesperson(null)}
      >
        <Modal.Body className="bg-white rounded pl-10 pr-10">
          {selectedSalesperson !== null && (
            <div className=" pl-10 md:pl-24">
              <table className="w-full table-fixed">
                <tr>
                  <th className="py-2 color">Name</th>
                  <td className="break-words ">
                    {selectedSalesperson.login_id}
                  </td>
                </tr>
                <tr>
                  <th className="py-2 color">Mobile No</th>
                  <td> {selectedSalesperson.mobileNo}</td>
                </tr>
              </table>
            </div>
          )}
          <div className="flex justify-center mt-2">
            <div
              className="btn n-color text-white rounded-full py-2 px-4 mt-2 "
              onClick={() => setSelectedSalesperson(null)}
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
                    <th className="m-table color table-width">Name </th>
                    <td className="m-table break-words uppercase"><b style={{ paddingRight: '20px' }}>:</b>
                      {selectedQuotationDetails.name}
                    </td>
                  </tr>
                  <tr>
                    <th className="m-table color table-width">Date </th>
                    <td className="m-table break-words uppercase"><b style={{ paddingRight: '20px' }}>:</b>
                      {selectedQuotationDetails.date
                        ? new Date(selectedQuotationDetails.date).toLocaleDateString('en-GB')
                        : ''}                    </td>
                  </tr>
                  <tr>
                    <th className="m-table color table-width">Mobil No.</th>
                    <td className="m-table"><b style={{ paddingRight: '20px' }}>:</b>{selectedQuotationDetails.mobileNo}</td>
                  </tr>
                  <tr>
                    <th className="m-table color table-width">Address </th>
                    <td className="m-table break-words uppercase"><b style={{ paddingRight: '20px' }}>:</b>
                      {selectedQuotationDetails.address}
                    </td>
                  </tr>
                  <tr>
                    <th className="m-table color table-width">Address Two</th>
                    <td className="m-table"><b style={{ paddingRight: '20px' }}>:</b>{selectedQuotationDetails.addressTwo}</td>
                  </tr>
                  <tr>
                    <th className="m-table color table-width">Next Emerging Date</th>
                    <td className="m-table break-words">
                      <b style={{ paddingRight: '20px' }}>:</b>
                      {selectedQuotationDetails.nextEmergingDate
                        ? new Date(selectedQuotationDetails.nextEmergingDate).toLocaleDateString('en-GB')
                        : ''}
                    </td>
                  </tr>

                  <tr>
                    <th className="m-table color table-width">Remark</th>
                    <td className="m-table"><b style={{ paddingRight: '20px' }}>:</b>{selectedQuotationDetails.remark}</td>
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

export default function Saleslist() {
  const [salesperson, setSalesperson] = React.useState([]);//show list of sales person
  const [isLoading, setIsLoading] = React.useState(true);//set loader when api response get data
  const [startDate, setStartDate] = React.useState('');//set the form date which selected
  const [endDate, setEndDate] = React.useState('');//set to date which selected

  const [page, setPage] = React.useState(1);//set a page in pagination
  const rowsPerPage = 10;

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const saved = localStorage.getItem(process.env.REACT_APP_KEY);

        const response = await axios.get(`${BaseUrl}/marketingPerson/getAll`, {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        });

        setSalesperson(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchData();

  }, []);


  const indexOfLastItem = page * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const displayedSalesperson = salesperson.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event, value) => {
    setPage(value);
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

  const handleSearch = async (SalesPersonName) => {
    setPage(1);
    try {
      const saved = localStorage.getItem(process.env.REACT_APP_KEY);

      const response = await axios.get(`${BaseUrl}/salesPerson/search/?SalesPersonName=${SalesPersonName}`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      });

      console.log(response.data.data);
      setSalesperson(response.data.data);
    } catch (error) {
      console.log(error);
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
                name=""
                id=""
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
      <Container>
        <div className="row md:mx-auto mx-auto align-items-center">
          <Col xs={12} md={4} lg={6} >
            <Breadcrumb className="font-bold pb-1 color">
              <Breadcrumb.Item
                linkAs={Link}
                linkProps={{ to: routeUrls.DASHBOARD }}
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: routeUrls.MARKETINGLIST }}>
                Marketing Person List
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col xs={12} md={4} lg={3} className="d-flex align-items-center px-0">

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

          </Col>
          <Col xs={12} md={4} lg={3} className="flex px-0 items-center md:my-0 my-2">


            <div>
              <Link to={`${routeUrls.MYMRAKETINGFORM}`}>
                <div className="flex items-center border-solid border-2 border-[#49413C] rounded px-1">
                  <p className="leading-normal pr-1">Add Marketing Person</p>
                  <AiOutlinePlus className="fs-5 " />
                </div>
              </Link>
            </div>
            <div>
              <Link to={`${routeUrls.MRAKETINGFORM}`}>
                <div className="flex items-center border-solid border-2 border-[#49413C] rounded px-1">
                  <p className="leading-normal pr-1">Add Data</p>
                  <AiOutlinePlus className="fs-5 " />
                </div>
              </Link>
            </div>
          </Col>
        </div>
      </Container>

      <div className="container my-5 table-auto">
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead style={{ borderBottom: '2px solid rgba(224, 224, 224, 1)' }}>
              <TableRow>
                <TableCell />
                <TableCell class='color'> Name</TableCell>
                <TableCell class='color-1' align="center">Excel</TableCell>
                <TableCell class='color-1' align="center" className="font-bold">
                  Detalis
                </TableCell>
                {/* <TableCell class='color-1' align="center">Delete</TableCell> */}
                {/* <TableCell class='color-1' align="center">Edit</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedSalesperson.map((row) =>
                row && row.login_id ? (
                  <Row key={row._id} row={row} setSalesperson={setSalesperson} startDate={startDate}
                    endDate={endDate} />
                ) : null
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="d-flex justify-center">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(salesperson.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
          />
        </Stack>
      </div>
    </>
  );
}
