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
import Spinner from 'react-bootstrap/Spinner';
import { AiOutlineDownload } from "react-icons/ai"
let BaseUrl = process.env.REACT_APP_BASEURL

function Row(props) {
  const { row, setQuotation } = props;
  const [open, setOpen] = React.useState(false);
  const [selectedQuotationID, setSelectedQuotationId] = React.useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    React.useState(false);
  const [selectedQuotationDetails, setselectedQuotationDetails] =
    React.useState(null);
    const [approve, setApprove] =React.useState('');  
    const [reject, setReject] =React.useState('');    
    const [followUp, setFollowUp] =React.useState(true);
  const [disableDropdown, setDisableDropdown] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("Follow Up")


  const handleviewdata = (id) => {
    // setLoading(true);

    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    let tableData;
    axios
      .get(`${BaseUrl}/quotation/viewdata/${id}`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      })
      .then(function (response) {
        const userData = response.data.data1;
        const timestamp = new Date(userData.Date);
        console.log(userData);
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
            // setLoading(false);
          })
          .catch(function (error) {
            console.log(error);
            // setLoading(false);
          });
      })
      .catch(function (error) {
        console.log(error);
        // setLoading(false);
      });
  };

  const handleDelete = () => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .delete(
        `${BaseUrl}/quotation/delete/data/${selectedQuotationID}`,
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
  const handleApprove = async (id) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    try {
      const response = await axios.post(
        `${BaseUrl}/follow/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        }
      );
      if (response.data.status === "Success") {
        const {Approve,Reject}=response.data.data
        setApprove(Approve);
        setReject(Reject);
        setFollowUp(false);
        localStorage.setItem(`status_${id}`, 'Approve');
      
      } else {
       console.log(">>",approve,reject,followUp);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleReject = async (id) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    try {
      const response = await axios.post(
        `${BaseUrl}/follow/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        }
      );
      if (response.data.status === "Success") {
        setApprove(false);
        setReject(true);
        setFollowUp(false);
        localStorage.setItem(`status_${id}`, 'Reject');
      } else {
       console.log(">>>reject",reject,approve,followUp);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleDownloadPDF = (id) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .get(`${BaseUrl}/quatation/pdf/${id}`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(">>>>>>>>>", response);
          const binaryData = atob(response.data.data);

          const byteArray = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            byteArray[i] = binaryData.charCodeAt(i);
          }

          const blob = new Blob([byteArray], { type: 'application/pdf' })

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';

          a.download = 'document.pdf';

          a.href = url;
          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          console.log('PDF downloaded successfully');
        } else {
          console.error('PDF download failed:', response.status, response.statusText);
        }
      })
      .catch((error) => {
        console.error('Error downloading PDF:', error);
      });
  };
 

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);

    if (selectedValue === 'Approve') {
      handleApprove(row._id);
      setDisableDropdown(true);
    } else if (selectedValue === 'Reject') {
      handleReject(row._id);
      setDisableDropdown(true);
    }
    localStorage.setItem(`selectedValue_${row._id}`, selectedValue);
  };
  const fetchDatabaseValue = (selectedValue, id) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios.get(`${BaseUrl}/follow/${selectedValue.toLowerCase()}/${id}`, {
      headers: {
        Authorization: `Bearer ${saved}`,
      },
    })
    .then(function (response) {
      if (response.data.status === "Success") {
        if (selectedValue === 'Approve') {
          setApprove(response.data.data.Approve);
          setReject(response.data.data.Reject);
        } else if (selectedValue === 'Reject') {
          setReject(response.data.data.Reject);
          setApprove(response.data.data.Approve);
        }
        setFollowUp(false);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  React.useEffect(() => {
    const savedSelectedValue = localStorage.getItem(`status_${row._id}`);
    if (savedSelectedValue) {
      setSelectedValue(savedSelectedValue);
      if (savedSelectedValue === 'Approve' || savedSelectedValue === 'Reject') {
        setDisableDropdown(true);
        if (savedSelectedValue === 'Approve') {
          fetchDatabaseValue('Approve', row._id); 
        } else if (savedSelectedValue === 'Reject') {
          fetchDatabaseValue('Reject', row._id); 
        }
      }
    }
  }, [row._id]);

  function getTrueStatus(followDetails) {
    if (!followDetails || !Array.isArray(followDetails)) {
      return 'Status not available';
    }
  
    if (followDetails.some((detail) => detail.Approve)) {
      return 'Approve';
    }
    
    if (followDetails.some((detail) => detail.Reject)) {
      return 'Reject';
    }    
    return 'Follow Up';
  }
  return (
    <>
      <React.Fragment>
        <TableRow style={{ borderBottom: '3px solid rgba(224, 224, 224, 1)' }} >
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
              className="mx-auto edit-icon"
              style={{ cursor: "pointer" }}
              onClick={() => handleviewdata(row._id)}
            />
          </TableCell>
          <TableCell align="right">
            <MdDeleteForever
              className="mx-auto delete-icon"
              style={{ cursor: "pointer" }}
              onClick={() => confirmDelete(row._id)}
            />
          </TableCell>
          <TableCell align="right">
            <Link to={`${routeUrls.QUOTATION}/${row._id}`}>
              <BiEdit className="mx-auto edit-icon" style={{ cursor: "pointer" }} />
            </Link>
          </TableCell>
          <TableCell align="center" className="status-cell">
  {getTrueStatus(row.followDetails) === 'Follow Up' ? (
    <select
      className="text-sm py-2 status-cell"
      style={{
        backgroundColor: "white",
        color: "black",
      }}
      value={selectedValue}
      onChange={handleSelectChange}
      disabled={disableDropdown}
    >
      <option value="Follow Up">Follow Up</option>
      <option value="Approve">Approve</option>
      <option value="Reject">Reject</option>
    </select>
  ) : (
    <TableCell align="center" className="status-cell" style={{ wordBreak: "break-word", width: '15%' }}>
      {getTrueStatus(row.followDetails)}
    </TableCell>
  )}
</TableCell>
          <TableCell  className="download-icon-cell">
            <AiOutlineDownload className="fs-4" onClick={() => handleDownloadPDF(row._id)} style={{ cursor: "pointer" }} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Architec
                </Typography>
                <div className="md:nested-table-container">
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" >Architec Name</TableCell>
                        <TableCell align="center" >Mobile No.</TableCell>
                        <TableCell align="center" >Address</TableCell>
                      </TableRow>
                    </TableHead>
                    {row.architecture && row.architecture.length > 0 && (
                      <TableBody>
                        {row.architecture?.map((architectureRow, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row" align="center" style={{ width: "15%" ,textTransform:"uppercase" , wordBreak: "break-word"}}>
                              {architectureRow.architecsName}
                            </TableCell>
                            <TableCell align="center" style={{ width: "15%" }}>
                              {architectureRow.mobileNo}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{ wordBreak: "break-word", width: "15%" }}
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
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Carpenter
                </Typography>
                <div className="md:nested-table-container">
                  <Table
                    size="small"
                    aria-label="purchases" >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" >Carpenter Name</TableCell>
                        <TableCell align="center" >Mobile No.</TableCell>
                        <TableCell align="center" >Address</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.carpenter?.map((carpenterRow) => (
                        <TableRow>
                          <TableCell component="th" scope="row" align="center" style={{ width: "15%", wordBreak: "break-word" ,textTransform:"uppercase" }}>
                            {carpenterRow.carpentersName}
                          </TableCell>
                          <TableCell align="center" style={{ width: "15%", wordBreak: "break-word" }}>
                            {carpenterRow.mobileNo}
                          </TableCell>
                          <TableCell align="center" style={{ width: "15%", wordBreak: "break-word" }}>
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
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Shop
                </Typography>
                <div className="md:nested-table-container">
                  <Table
                    size="small"
                    aria-label="purchases" >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" >Shop Name</TableCell>
                        <TableCell align="center" >Mobile No.</TableCell>
                        <TableCell align="center" >Address</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.shop?.map((shopRow) => (
                        <TableRow>
                          <TableCell component="th" scope="row" align="center" style={{ width: "15%" , textTransform:"uppercase" ,wordBreak: "break-word"}}>
                            {shopRow.shopName}
                          </TableCell>
                          <TableCell align="center" style={{ width: "15%", wordBreak: "break-word" }}>
                            {shopRow.mobileNo}
                          </TableCell>
                          <TableCell align="center" style={{ width: "15%" , wordBreak: "break-word"}}>
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
            <div style={{width:'400px',display:'flex'}}>
              <table  className=" mx-2">
                {/* <tbody className="table-con"> */}
                    <tr >
                      <th style={{width:'200px'}}>Token No :</th>
                      <td style={{width:'200px'}}> {selectedQuotationDetails.tokenNo}</td>
                    </tr>
                    <tr>
                      <th className="py-2 ">Date :</th>
                      <td> {selectedQuotationDetails.Date}</td>
                    </tr>
                    <tr>
                      <th className="py-2">Name :</th>
                      <td className="break-words uppercase">
                        {" "}
                        {selectedQuotationDetails.name}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-2 ">Mobile No :</th>
                      <td> {selectedQuotationDetails.mobileNo}</td>
                    </tr>
                    <tr>
                      <th className="py-2">Address :</th>
                      <td className="break-words">
                        {" "}
                        {selectedQuotationDetails.address}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-2">Architec :</th>
                      <td> {selectedQuotationDetails.architec}</td>
                    </tr>{" "}
                    <tr>
                      <th className="py-2">Carpenter :</th>
                      <td> {selectedQuotationDetails.carpenter}</td>
                    </tr>{" "}
                    <tr>
                      <th className="py-2">shop :</th>
                      <td> {selectedQuotationDetails.shop}</td>
                    </tr>
                    <tr>
                      <th className="py-2">Sales Person :</th>
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
                {/* </tbody> */}
              </table>
            </div>
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
      .get(`${BaseUrl}/quotation/listdata`, {
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
 
  const handleSearch = (inputValue) => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    let url = `${BaseUrl}/quotation/searchdata?`;

    const isNumber = !isNaN(inputValue);

    if (isNumber) {
      url = `${url}serialNumber=${inputValue}`;
    } else {
    url = `${url}userName=${inputValue}`;
    }

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
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="dark" />
    </div>;
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
                <TableCell>Token No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">Detalis</TableCell>
                <TableCell align="center">Delete</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Status</TableCell>
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
