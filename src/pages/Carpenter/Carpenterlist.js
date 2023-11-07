
import * as React from "react";
import {Box,Collapse,IconButton,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Typography,Paper} from "@mui/material";
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
let BaseUrl = process.env.REACT_APP_BASEURL

function Row({ row, setCarpenter }) {
  const [open, setOpen] = React.useState(false);//open dropdown connected quotation
  const [selectedCarpenterId, setSelectedCarpenterId] = React.useState(null);//set id to delete data
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);//set confirmation of delete
  const [selectedCarpenterDetails, setSelectedCarpenterDetails] =
    React.useState(null);//show data of carpenter
  const [Quotation, setQuotation] = React.useState([]);//show Quotation data
  const [selectedQuotationDetails, setselectedQuotationDetails] =
    React.useState(null);//show Quotation data in model

  const handleviewQutotation = (id) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    let tableData;
    axios
      .get(`${BaseUrl}/quotation/viewdata/${id}`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      })
      .then(function (response) {
        const QuotationData = response.data.data1;
        console.log(QuotationData);
        axios
          .get(`${BaseUrl}/total/view/${id}`, {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          })
          .then(function (response2) {
            tableData = response2.data.data;
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
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleviewdata = (id) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);

    axios
      .get(`${BaseUrl}/carpenter/viewdata/${id}`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        setSelectedCarpenterDetails(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDelete = () => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .delete(
        `${BaseUrl}/carpenter/data/delete/${selectedCarpenterId}`,
        {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        }
      )
      .then(function (response) {
        console.log(response.data.data);
        setCarpenter((prevCarpenters) =>
          prevCarpenters.filter(
            (carpenter) => carpenter._id !== selectedCarpenterId
          )
        );
        setShowDeleteConfirmation(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const confirmDelete = (id) => {
    setSelectedCarpenterId(id);
    setShowDeleteConfirmation(true);
  };

  const handleSubmit = (id) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .get(`${BaseUrl}/carpenter/listdata/${id}`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      })
      .then(function (response) {
        setQuotation({ Quotation: response.data.data });
        console.log({ Quotation: response.data.data });
      })
      .catch(function (error) {
        console.log(error);
      });
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
          <TableCell component="th" scope="row" class="color uppercase">
            {row.carpentersName}
          </TableCell>
          <TableCell align="center">
            <FaStreetView
              className="mx-auto color"
              onClick={() => handleviewdata(row._id)}
            />
          </TableCell>
          <TableCell align="center">
            <MdDeleteForever
              className="mx-auto color"
              onClick={() => confirmDelete(row._id)}
            />
          </TableCell>
          <TableCell align="right">
            <Link to={`${routeUrls.CARPENTERFORM}/${row._id}`}>
              <BiEdit className="mx-auto color"/>
            </Link>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" className="color" gutterBottom component="div">
                  Quotation
                </Typography>
                <div>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" class='color-1'>Token Number</TableCell>
                        <TableCell align="center" class='color-1'>Name</TableCell>
                        <TableCell align="center" class='color-1'>Mobile No.</TableCell>
                        <TableCell align="center" class='color-1'>Address</TableCell>
                        <TableCell align="center" class='color-1'>Detalis</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Quotation.Quotation?.map((QuotationRow) => (
                        <TableRow key={QuotationRow._id}>
                          <TableCell
                          class='color-1'
                            align="center"
                            style={{ wordBreak: "break-word", width: "15%" }}
                          >
                            {QuotationRow.serialNumber}
                          </TableCell>
                          <TableCell
                           class='color-1'
                            scope="row"
                            align="center"
                            style={{ width: "15%", textTransform: "uppercase" }}
                          >
                            {QuotationRow.userName}
                          </TableCell>
                          <TableCell align="center" class='color-1' style={{ width: "15%" }}>
                            {QuotationRow.mobileNo}
                          </TableCell>
                          <TableCell
                            align="center"
                            class='color-1'
                            style={{ wordBreak: "break-word", width: "15%" }}
                          >
                            {QuotationRow.address}
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
        show={selectedCarpenterDetails !== null}
        onHide={() => setSelectedCarpenterDetails(null)}
      >
        <Modal.Body className="bg-white rounded">
          {selectedCarpenterDetails !== null && (
            <div className="pl-10 md:pl-24">
              <table className="w-full table-fixed">
                <tr>
                  <th className="py-2 sm:px-0 color">Carpenter Name</th>
                  <td> {selectedCarpenterDetails.carpentersName}</td>
                </tr>
                <tr>
                  <th className="py-2 sm:px-0 color">Mobile No</th>
                  <td> {selectedCarpenterDetails.mobileNo}</td>
                </tr>
                <tr>
                  <th className="py-2 sm:px-0 color">Address</th>
                  <td className="break-words">
                    {selectedCarpenterDetails.address}
                  </td>
                </tr>
              </table>
            </div>
          )}
          <div className="flex justify-center mt-2">
            <div
              className="btn n-color text-white rounded-full py-2 px-4 mt-2"
              onClick={() => setSelectedCarpenterDetails(null)}
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
          {selectedQuotationDetails!== null &&(
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <th className="m-table color">Token No</th>
                    <th style={{ padding: '8px', textAlign: 'right', whiteSpace: 'nowrap' }}>: </th>
                    <td className="m-table">{selectedQuotationDetails.tokenNo}</td>
                  </tr>
                  <tr>
                    <th className="m-table color">Date</th>
                    <th style={{ padding: '8px', textAlign: 'right', whiteSpace: 'nowrap' }}>: </th>
                    <td className="m-table">{selectedQuotationDetails.Date}</td>
                  </tr>
                  <tr>
                    <th className="m-table color">Name </th>
                    <th style={{ padding: '8px', textAlign: 'right', whiteSpace: 'nowrap' }}>: </th>
                    <td className="m-table break-words uppercase">
                      {selectedQuotationDetails.name}
                    </td>
                  </tr>
                  <tr>
                    <th className="m-table color">Mobile No</th>
                    <th style={{ padding: '8px', textAlign: 'right', whiteSpace: 'nowrap' }}>: </th>
                    <td className="m-table">{selectedQuotationDetails.mobileNo}</td>
                  </tr>
                  <tr>
                    <th className="m-table color">Address</th>
                    <th style={{ padding: '8px', textAlign: 'right', whiteSpace: 'nowrap' }}>: </th>
                    <td className="m-table break-words">
                      {selectedQuotationDetails.address}
                    </td>
                  </tr>
                  <tr>
                    <th className="m-table color">Architec</th>
                    <th style={{ padding: '8px', textAlign: 'right', whiteSpace: 'nowrap' }}>: </th>
                    <td className="m-table">{selectedQuotationDetails.architec}</td>
                  </tr>
                  <tr>
                    <th className="m-table color">Carpenter</th>
                    <th style={{ padding: '8px', textAlign: 'right', whiteSpace: 'nowrap' }}>: </th>
                    <td className="m-table">{selectedQuotationDetails.carpenter}</td>
                  </tr>
                  <tr>
                    <th className="m-table color">shop</th>
                    <th style={{ padding: '8px', textAlign: 'right', whiteSpace: 'nowrap' }}>: </th>
                    <td className="m-table">{selectedQuotationDetails.shop}</td>
                  </tr>
                  <tr>
                    <th className="m-table color">Sales Person</th>
                    <th style={{ padding: '8px', textAlign: 'right', whiteSpace: 'nowrap' }}>: </th>
                    <td className="m-table">{selectedQuotationDetails.sales}</td>
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
          ) }
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

export default function Carpenterlist() {
  const [carpenter, setCarpenter] = React.useState([]);//to show carpenter list (data)
  const [isLoading, setIsLoading] = React.useState(true);//set loader when api response get the data
  const [currentPage, setCurrentPage] = React.useState(1);//set page for pagination
  const itemsPerPage = 10;

  React.useEffect(() => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);

    axios
      .get(`${BaseUrl}/carpenter/list`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      })
      .then(function (response) {
        setCarpenter(response.data.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(carpenter.length / itemsPerPage);
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = carpenter.slice(startIndex, endIndex);

  const handleSearch = (carpentersName) => {
    setCurrentPage(1);
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .get(
        `${BaseUrl}/carpenter/searchdata?carpentersName=${carpentersName}`,
        {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        }
      )
      .then(function (response) {
        console.log(response.data.data);
        setCarpenter(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
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
                  className="search-input py-1  pr-2 ps-10 md:w-80 w-40 rounded-md	text-black"
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
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: routeUrls.CARPENTERLIST }}>
            Carpenter List
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="container my-5 table-auto">
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell class="color">carpenter Name</TableCell>
                <TableCell class='color-1' align="center" className="font-bold">
                  Detalis
                </TableCell>
                <TableCell class='color-1'align="center">Delete</TableCell>
                <TableCell class='color-1' align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsToDisplay.map((row) =>
                row && row.carpentersName ? (
                  <Row key={row._id} row={row} setCarpenter={setCarpenter} followDetails={row.followDetails} />
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
