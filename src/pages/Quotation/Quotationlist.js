import * as React from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import axios from "axios";
import { FaStreetView } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiSearch, BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { Breadcrumb, Col, Container, Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";

function Row(props) {
  const { row, setQuotation } = props;
  const [open, setOpen] = React.useState(false);
  const [selectedQuotationID, setSelectedQuotationId] = React.useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    React.useState(false);
  const [selectedQuotationDetails, setselectedQuotationDetails] =
    React.useState(null);
  const [Loading, setLoading] = React.useState(false);

  const handleviewdata = (id) => {
    setLoading(true);

    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    let tableData;
    axios
      .get(`http://localhost:2002/api/quotation/viewdata/${id}`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      })
      .then(function (response) {
        const userData = response.data.data1;
        const timestamp = new Date(userData.Date);
        console.log(userData);
        axios
          .get(`http://localhost:2002/api/total/view/${id}`, {
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
            const salesName = userData.sales ? userData.sales.Name : "";
            if (!Array.isArray(tableData)) {
              tableData = [tableData];
            }
            console.log("tabledataa", tableData);
            let architecNames = "";
            let carpenterNames = "";
            let shopNames = "";

            if (userData.architec) {
              architecNames = userData.architec
                .map((architec) => architec.architecsName)
                .join(", ");
            }
            if (userData.carpenter) {
              carpenterNames = userData.carpenter
                .map((carpenter) => carpenter.carpentersName)
                .join(", ");
            }
            if (userData.shop) {
              shopNames = userData.shop.map((shop) => shop.shopName).join(", ");
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
              tokenNo: userData.serialNumber,
              Date: timestamp.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }),
              name: userData.userName,
              mobileNo: userData.mobileNo,
              address: userData.address,
              innerTable: innerTableRows,
              mainTotal: mainTotal,
              architec: architecNames,
              carpenter: carpenterNames,
              shop: shopNames,
              sales: salesName,
            });
            setLoading(false);
          })
          .catch(function (error) {
            console.log(error);
            setLoading(false);
          });
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  };

  const handleDelete = () => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .delete(
        `http://localhost:2002/api/quotation/delete/data/${selectedQuotationID}`,
        {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        }
      )
      .then(function (response) {
        console.log(response.data.data);
        setQuotation((prevQuotation) =>
          prevQuotation.filter(
            (quotation) => quotation._id !== selectedQuotationID
          )
        );
        setShowDeleteConfirmation(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const confirmDelete = (id) => {
    setSelectedQuotationId(id);
    setShowDeleteConfirmation(true);
  };
  return (
    <>
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.serialNumber}
          </TableCell>
          <TableCell component="th" scope="row" className="uppercase">
            {row.userName}
          </TableCell>
          <TableCell align="center">
            <FaStreetView
              className="mx-auto"
              onClick={() => handleviewdata(row._id)}
            />
          </TableCell>
          <TableCell align="right">
            <MdDeleteForever
              className="mx-auto"
              onClick={() => confirmDelete(row._id)}
            />
          </TableCell>
          <TableCell align="right">
            <Link to={`${routeUrls.QUOTATION}/${row._id}`}>
              <BiEdit className="mx-auto" />{" "}
            </Link>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Architecture
                </Typography>
                <div className="nested-table-container">
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" style={{ width: "30%" }}>
                          Architecture Name
                        </TableCell>
                        <TableCell align="center" style={{ width: "30%" }}>
                          Mobile No.
                        </TableCell>
                        <TableCell align="center" style={{ width: "30%" }}>
                          Address
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    {row.architecture && row.architecture.length > 0 && (
                      <TableBody>
                        {row.architecture?.map((architectureRow, index) => (
                          <TableRow key={index}>
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                              style={{ width: "30%" }}
                            >
                              {architectureRow.architecsName}
                            </TableCell>
                            <TableCell align="center" style={{ width: "30%" }}>
                              {architectureRow.mobileNo}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{ wordBreak: "break-word", width: "30%" }}
                            >
                              {architectureRow.address}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    )}
                  </Table>
                </div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Carpenter
                </Typography>
                <div className="nested-table-container">
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" style={{ width: "30%" }}>
                          Carpenter Name
                        </TableCell>
                        <TableCell align="center" style={{ width: "30%" }}>
                          Mobile No.
                        </TableCell>
                        <TableCell align="center" style={{ width: "30%" }}>
                          Address
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.carpenter?.map((carpenterRow) => (
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            style={{ width: "30%" }}
                          >
                            {carpenterRow.carpentersName}
                          </TableCell>
                          <TableCell align="center" style={{ width: "30%" }}>
                            {carpenterRow.mobileNo}
                          </TableCell>
                          <TableCell align="center" style={{ width: "30%" }}>
                            {carpenterRow.address}
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
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Shop
                </Typography>
                <div className="nested-table-container">
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" style={{ width: "30%" }}>
                          Shop Name
                        </TableCell>
                        <TableCell align="center" style={{ width: "30%" }}>
                          Mobile No.
                        </TableCell>
                        <TableCell align="center" style={{ width: "30%" }}>
                          Address
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.shop?.map((shopRow) => (
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            style={{ width: "30%" }}
                          >
                            {shopRow.shopName}
                          </TableCell>
                          <TableCell align="center" style={{ width: "30%" }}>
                            {shopRow.mobileNo}
                          </TableCell>
                          <TableCell align="center" style={{ width: "30%" }}>
                            {shopRow.address}
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
                className=" rounded-full"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                No
              </button>
              <button className=" rounded-full" onClick={handleDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        show={selectedQuotationDetails !== null}
        onHide={() => setselectedQuotationDetails(null)}
      >
        <Modal.Body className="bg-white rounded" >
          {selectedQuotationDetails ? (
            // <div className="overflow-visible">
              <table  className="table-fixed mx-2">
                <tbody className="table-con">
                    <tr>
                      <th className="py-2">Token No</th>
                      <td> {selectedQuotationDetails.tokenNo}</td>
                    </tr>
                    <tr>
                      <th className="py-2 ">Date</th>
                      <td> {selectedQuotationDetails.Date}</td>
                    </tr>
                    <tr>
                      <th className="py-2">Name</th>
                      <td className="break-words uppercase">
                        {" "}
                        {selectedQuotationDetails.name}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-2 ">Mobile No</th>
                      <td> {selectedQuotationDetails.mobileNo}</td>
                    </tr>
                    <tr>
                      <th className="py-2">Address</th>
                      <td className="break-words">
                        {" "}
                        {selectedQuotationDetails.address}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-2">Architec</th>
                      <td> {selectedQuotationDetails.architec}</td>
                    </tr>{" "}
                    <tr>
                      <th className="py-2">Carpenter</th>
                      <td> {selectedQuotationDetails.carpenter}</td>
                    </tr>{" "}
                    <tr>
                      <th className="py-2">shop</th>
                      <td> {selectedQuotationDetails.shop}</td>
                    </tr>
                    <tr>
                      <th className="py-2">Sales Person</th>
                      <td> {selectedQuotationDetails.sales}</td>
                    </tr>
                  {/* <div className="mx-auto"> */}
                    <tr className=" text-center">
                      <table className="table-container border border-separate my-3">
                        <thead>
                          <tr>
                            <th className="border">Description</th>
                            <th className="border ">Area</th>
                            <th className="border ">Size</th>
                            <th className="border ">Rate</th>
                            <th className="border ">Quantity</th>
                            <th className="border ">Total</th>
                          </tr>
                        </thead>
                        <tbody>{selectedQuotationDetails.innerTable}</tbody>
                        <tr className="text-right">
                      <th colSpan="5">Main Total:</th>
                      <td className="border">{selectedQuotationDetails.mainTotal}</td>
                    </tr>
                      </table>
                    </tr>
                  {/* </div> */}
                </tbody>
              </table>
            // </div>
          ) : (
            <p>....Loading</p>
          )}
          <div className="flex justify-center mt-2">
            <div
              className="btn bg-black text-white rounded-full py-2 px-4 mt-2 "
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

export default function Quotationlist() {
  const [quotation, setQuotation] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .get(`http://localhost:2002/api/quotation/listdata`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      })
      .then(function (response) {
        setQuotation(response.data.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
      });
  }, []);
  const handleSearch = (userName) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    const url = userName
      ? `http://localhost:2002/api/quotation/searchdata?userName=${userName}`
      : "http://localhost:2002/api/quotation/listdata";
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        setQuotation(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="bg-dark text-white rounded-br-full">
        <Container>
          <div className="row mb-3 py-3 lg:mx-0 ms-12">
            <Col md={6} sm={12}>
              <p className="md:text-2xl text-xl font-bold">TIMBERLAND</p>
            </Col>
            <Col md={6} sm={12} className="lg:pl-40">
              <div className="relative ">
                <input
                  type="search"
                  name=""
                  id=""
                  className="search-input py-1 ps-10 pr-2 md:w-80 w-40 rounded-md	text-black"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="absolute fs-5 bottom-1 left-2 text-black">
                  <BiSearch />
                </div>
              </div>
            </Col>
          </div>
        </Container>
      </div>
      <div className="md:ps-24 ps-10">
        <Breadcrumb className="font-bold">
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: routeUrls.DASHBOARD }}
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: routeUrls.QUOTATIONLIST }}
          >
            Quotation
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="container my-5 table-auto">
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>SR No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">Detalis</TableCell>
                <TableCell align="center">Delete</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotation.map((row) =>
                row && row.userName ? (
                  <Row key={row._id} row={row} setQuotation={setQuotation} />
                ) : null
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
