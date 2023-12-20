import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import Select from "react-select";
import { Breadcrumb, Container, Form } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";
import { AiOutlinePlusCircle } from "react-icons/ai";

const url = process.env.REACT_APP_BASEURL;

function QuotationForm() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    userName: "",
    mobileNo: "",
    address: "",
    Date: "",
  });

  const [rows, setRows] = useState([createNewRow()]);  // table row added
  const [modalState, setModalState] = useState({
    showModal: false,
    message: "",
    isSuccess: false,
  });  //show error message and create,update message
  
  const [architecture, setArchitecture] = useState([]); //architec in add drop dwon
  const [selectedArchitecture, setSelectedArchitecture] = useState([]); //api response in only name find
  const [carpenter, setCarpenter] = useState([]); //carpenter in add drop dwon
  const [selectCarpenter, selectsetCarpenter] = useState([]); //api response in only name find
  const [shop, setShop] = useState([]); //shop in add drop dwon
  const [selectShop, selectsetShop] = useState([]); //api response in only name find
  const [sale, setSale] = useState([]); // sale in add drop dwon
  const [selectSale, selectsetSale] = useState(null); //api response in only name find
  const [serialNub, setSerialNub] = useState(1); // auto genarate  serialnumber
  
  const [isCreatingArchitecture, setIsCreatingArchitecture] = useState(false); //create Architect show model
  const [newArchitecture, setNewArchitecture] = useState({
    name: "",
    mobileNo: "",
    address: "",
  }); //create new Architecture

  const [isCreatingCarpenter, setIsCreatingCarpenter] = useState(false); // create carpenter show model
  const [newCarpenter, setNewCarpenter] = useState({
    name: "",
    mobileNo: "",
    address: "",
  }); // create new Carpenter

  const [isCreatingShop, setIsCreatingShop] = useState(false); // create shop show model
  const [newShop, setNewShop] = useState({
    name: "",
    mobileNo: "",
    address: "",
  }); // create new shop

 function createNewRow() {
    return {
      description: "",
      area: "",
      size: "",
      rate: "",
      quantity: "",
      total: "",
    };
  }// create new row

  const addRowTable = () => {
    setRows((prevRows) => [...prevRows, createNewRow()]);
  };//table new row add

  const handleRowChange = (rowIndex, field, value) => {

    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex][field] = value;
      const size = parseFloat(newRows[rowIndex].size) || 0; // convert integer value in float value
      const rate = parseFloat(newRows[rowIndex].rate) || 0; // convert integer value in float value
      const quantity = parseFloat(newRows[rowIndex].quantity) || 0; // convert integer value in float value
      newRows[rowIndex].total = (size * rate * quantity).toFixed(2); // total 
      return newRows;
    });
  };
// architec ,carpenter, shop, salesperson name show in dropdwon
  useEffect(() => {
  const saved = localStorage.getItem(process.env.REACT_APP_KEY);

  async function fetchData(endpoint) {
    const timestamp = Date.now();
    try {
      const response = await axios.get(`${url}/${endpoint}?timestamp=${timestamp}`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  Promise.all([
    fetchData('architec/list'),
    fetchData('carpenter/list'),
    fetchData('shop/list'),
    fetchData('salesPerson/AllList'),
  ])
    .then(([architectureData, carpenterData, shopData, saleData]) => {
      setArchitecture(architectureData);
      setCarpenter(carpenterData);
      setShop(shopData);
      setSale(saleData);
        });
}, []);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem(process.env.REACT_APP_KEY);
      axios
        .get(`${url}/quotation/viewdata/${id}`, {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        })
        .then(function (response) {
          const { data1: quotationData, data: tableData } = response.data;
          const formattedDate = formatDate(quotationData.Date);

          setFormValues({
            userName: quotationData.userName,
            mobileNo: quotationData.mobileNo,
            address: quotationData.address,
            Date: formattedDate,
          });

          setRows(tableData);

          const architectureOptions = quotationData.architec.map((item) => ({
            label: item.architecsName,
            name: item._id,
          }));
          const carpenterOptions = quotationData.carpenter.map((item) => ({
            label: item.carpentersName,
            name: item._id,
          }));
          const shopOptions = quotationData.shop.map((item) => ({
            label: item.shopName,
            name: item._id,
          }));
          const saleOptions = quotationData.sales
            ? Array.isArray(quotationData.sales)
              ? quotationData.sales.map((item) => ({
                  label: item.Name,
                  name: item._id,
                }))
              : [{ label: quotationData.sales.Name }]
            : [];

          setSelectedArchitecture(architectureOptions);
          selectsetCarpenter(carpenterOptions);
          selectsetShop(shopOptions);
          selectsetSale(saleOptions);
          setSerialNub(quotationData.serialNumber);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [id]);

    const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .get(`${url}/quotation/listdata`, {
        headers: {
          Authorization: `Bearer ${saved}`,
        },
      })
      .then(function (response) {
        const res = response.data.data;
        if (res) {
          const usedTokenNumbers = res.map((item) => item.serialNumber);
          let newTokenNumber = 1;
          while (usedTokenNumbers.includes(newTokenNumber)) {
            newTokenNumber++;
          }
          setSerialNub(newTokenNumber);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleQuotation = async (e) => {
    e.preventDefault();
  
    const allFieldsEmpty = Object.values(formValues).every(
      (value) => value === ""
    );
    if (allFieldsEmpty) {
      setModalState({
        showModal: true,
        message: "Please Fill Required Fields",
        isSuccess: false,
      });
      return;
    }
  
    const requiredFields = ["description", "area", "size", "rate", "quantity", "total"];
  
    for (const row of rows) {
      for (const field of requiredFields) {
        if (!row[field]) {
          setModalState({
            showModal: true,
            message: `Please fill in the ${field} field in a row.`,
            isSuccess: false,
          });
          return;
        }
      }
    }
  
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
  
    const architectureIds = selectedArchitecture.map((item) => item.value);
    const carpenterIds = selectCarpenter.map((item) => item.value);
    const shopIds = selectShop.map((item) => item.value);
    const saleIds = selectSale ? selectSale.value : null;
  
    const data = {
      ...formValues,
      serialNumber: serialNub.toString(),
      architec: architectureIds,
      carpenter: carpenterIds,
      shop: shopIds,
      sales: saleIds,
      addtotal: rows,
    };
  
    try {
      const response = id
        ? await axios.put(`${url}/quotation/update/${id}`, data, {
            headers: { Authorization: `Bearer ${saved}` },
          })
        : await axios.post(`${url}/quotation/cerate`, data, {
            headers: { Authorization: `Bearer ${saved}` },
          });
  
      const isSuccess = response.data.status === "Success";
      setModalState({
        showModal: true,
        message: isSuccess ? (id ? "Quotation Update successful" : "Quotation Create successful") : response.data.message,
        isSuccess,
      });
    } catch (error) {
      setModalState({
        showModal: true,
        message: error.response.data.message,
        isSuccess: false,
      });
    }
  };
  

  const handleClose = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      showModal: false,
    }));
    if (
      modalState.message &&
      (modalState.message.includes("Quotation Create successful") ||
        modalState.message.includes("Quotation Update successful"))
    ) {
      navigate(routeUrls.DASHBOARD);
    }
  }, [modalState.message, navigate]);

  useEffect(() => {
    if (modalState.showModal) {
      const timer = setTimeout(() => {
        handleClose();
      }, 2000);
  
      return () => {
        clearTimeout(timer);
      };
    }
  }, [modalState.showModal, handleClose]);
// Create New Architec
  const handleSaveNewArchitecture = () => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .post(
        `${url}/architec/data/create`,
        {
          architecsName: newArchitecture.name,
          mobileNo: newArchitecture.mobileNo,
          address: newArchitecture.address,
        },
        {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        }
      )
      .then(function (response) {
        if (response.data && response.data.status === "Success") {
          setIsCreatingArchitecture(false);
          setModalState({
            showModal: true,
            message: response.data.message,
          });
          const newArchOption = {
            label: newArchitecture.name,
            value: response.data.architectureId,
          };
          setSelectedArchitecture([newArchOption]);
        } else {
          setModalState({
            showModal: true,
            message: response.data.message,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        setModalState({
          showModal: true,
          message: error.response.data.message,
          isSuccess: false,
        });
      });
  };
  const handleCloseCreateArchitecture = () => {
    setIsCreatingArchitecture(false);
  };
// create New  Carpenter
  const handleSaveNewCarpenter = () => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .post(
        `${url}/carpenter/data/create`,
        {
          carpentersName: newCarpenter.name,
          mobileNo: newCarpenter.mobileNo,
          address: newCarpenter.address,
        },
        {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        }
      )
      .then(function (response) {
        if (response.data && response.data.status === "Success") {
          setIsCreatingCarpenter(false);
          setModalState({
            showModal: true,
            message: "Carpenter Create successful",
          });
          const newCarpOption = {
            label: newCarpenter.name,
            value: response.data.carpenterId,
          };
          selectsetCarpenter([newCarpOption]);
        } else {
          setModalState({
            showModal: true,
            message: response.data.message,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        setModalState({
          showModal: true,
          message: error.response.data.message,
          isSuccess: false,
        });
      });
  };
  const handleCloseCreateCarpenter = () => {
    setIsCreatingCarpenter(false);
  };
  // Create New Shop
  const handleSaveNewShop = () => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .post(
        `${url}/shop/data/create`,
        {
          shopName: newShop.name,
          mobileNo: newShop.mobileNo,
          address: newShop.address,
        },
        {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        }
      )
      .then(function (response) {
        if (response.data && response.data.status === "Success") {
          setIsCreatingShop(false);
          setModalState({
            showModal: true,
            message: "Shop Create successful",
          });
          const newShopOption = {
            label: newShop.name,
            value: response.data.shopId,
          };
          selectsetShop([newShopOption]);
        } else {
          setModalState({
            showModal: true,
            message: response.data.message,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
        setModalState({
          showModal: true,
          message: error.response.data.message,
        });
      });
  };
  const handleCloseCreateShop = () => {
    setIsCreatingShop(false);
  };
  return (
    <>
      <Header />
      <div className="md:ps-24 ps-10">
        <Breadcrumb className="font-bold color">
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: routeUrls.DASHBOARD }}>
            Dashboard
          </Breadcrumb.Item>

          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: routeUrls.QUOTATION }}>
            Quotation
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <p className="md:text-4xl text-2xl color font-bold text-center mb-3">
        {id ? "Update Quotation Form" : "Create Quotation Form"}
      </p>
      <Container>
        <div>
          <Form className="w-50 sm:mx-auto " onSubmit={handleQuotation}>
            <div className="md:flex justify-between flex-none">
              <Form.Group
                className=" mb-3 md:w-72 w-72"
                controlId="formBasicEmail"
              >
                <Form.Label className="font-bold color">
                  Token No. <span className="text-red-600"> &#8727; </span>:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Token No. :"
                  onChange={(e) => setSerialNub(e.target.value)}
                  value={serialNub}
                />
              </Form.Group>
              <Form.Group
                className="mb-3 md:w-72 w-72"
                controlId="formBasicEmail"
              >
                <Form.Label className="font-bold color">
                  Date <span className="text-red-600"> &#8727; </span>:
                </Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Date :"
                  value={formValues.Date}
                  onChange={(e) =>
                    setFormValues({ ...formValues, Date: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <div className="md:flex justify-between flex-none">
              <Form.Group
                className="mb-3 md:w-72 w-72"
                controlId="formBasicEmail"
              >
                <Form.Label className="font-bold color">
                  Name <span className="text-red-600"> &#8727; </span>:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name :"
                  value={formValues.userName}
                  className="uppercase"
                  onChange={(e) =>
                    setFormValues({ ...formValues, userName: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group
                className="mb-3 md:w-72 w-72"
                controlId="formBasicPassword"
              >
                <Form.Label className="font-bold color">
                  Mobile No. <span className="text-red-600"> &#8727; </span>:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Mobile No. :"
                  value={formValues.mobileNo}
                  onChange={(e) =>
                    setFormValues({ ...formValues, mobileNo: e.target.value })
                  }
                />
              </Form.Group>
            </div>
            <Form.Group
              className="mb-3 md:w-full w-72"
              controlId="formBasicPassword"
            >
              <Form.Label className="font-bold color">
                Address <span className="text-red-600"> &#8727; </span>:
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Address :"
                value={formValues.address}
                onChange={(e) =>
                  setFormValues({ ...formValues, address: e.target.value })
                }
              />
            </Form.Group>
            <div className="">
              <table className="">
                <thead>
                  <tr>
                    <th className="color">
                      Description<span className="text-red-600"> &#8727; </span>
                    </th>
                    <th className="color">
                      Area<span className="text-red-600"> &#8727; </span>
                    </th>
                    <th className="color">
                      Size<span className="text-red-600"> &#8727; </span>
                    </th>
                    <th className="color">
                      Rate<span className="text-red-600"> &#8727; </span>
                    </th>
                    <th className="color">
                      Quantity<span className="text-red-600"> &#8727; </span>
                    </th>
                    <th className="color">
                      Total<span className="text-red-600"> &#8727; </span>
                    </th>
                    <th className="color">
                      <button type="button" className="" onClick={addRowTable}>
                        <AiOutlinePlusCircle className="fs-3" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <>
                  {rows.map((row, rowIndex) => (
                    <tbody key={rowIndex}>
                      <tr>
                        <td>
                          <input
                            type="text"
                            value={row.description || ""}
                            onChange={(e) =>
                              handleRowChange( rowIndex, "description", e.target.value )
                            }
                            className="form-control" />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.area || ""}
                            onChange={(e) =>
                              handleRowChange(rowIndex, "area", e.target.value)
                            }
                            className="form-control" />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.size || ""}
                            onChange={(e) =>
                              handleRowChange(rowIndex, "size", e.target.value)
                            }
                            className="form-control" />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.rate || ""}
                            onChange={(e) =>
                              handleRowChange(rowIndex, "rate", e.target.value)
                            }
                            className="form-control" />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.quantity || ""}
                            onChange={(e) =>
                              handleRowChange( rowIndex, "quantity", e.target.value)
                            }
                            className="form-control" />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.total || ""}
                            onChange={(e) =>
                              handleRowChange(rowIndex, "total", e.target.value)
                            }
                            className="form-control" />
                        </td>
                      </tr>
                    </tbody>
                  ))}
                  <tfoot>
                    <tr>
                      <td colSpan={5} align="right">
                        Main Total
                      </td>
                      <td>
                        {rows
                          .reduce(
                            (total, row) =>
                              total + (parseFloat(row.total) || 0), 0 )
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </>
              </table>
            </div>
            <p className="font-bold color">Architec Name</p>
            <Select
              isMulti
              className="md:w-full w-72"
              options={[
                { label: "Create New Architec", value: "create" },
                ...(architecture.map((name) => ({
                  label: name.architecsName,
                  value: name._id,
                })) || []),
              ]}
              value={selectedArchitecture}
              onChange={(selectedOption) => {
                if (
                  selectedOption.some((option) => option.value === "create")
                ) {
                  setIsCreatingArchitecture(true);
                  setSelectedArchitecture([]);
                } else {
                  setIsCreatingArchitecture(false);
                  setSelectedArchitecture(selectedOption);
                }
              }}
            />
            <p className="font-bold color">Carpenter Name</p>
            <Select
              isMulti
              className="md:w-full w-72"
              options={[
                { label: "Create New Carpenter", value: "create" },
                ...(carpenter.map((name) => ({
                  label: name.carpentersName,
                  value: name._id,
                })) || []),
              ]}
              value={selectCarpenter}
              onChange={(selectedOption) => {
                if (
                  selectedOption.some((option) => option.value === "create")
                ) {
                  setIsCreatingCarpenter(true);
                  selectsetCarpenter([]);
                } else {
                  setIsCreatingCarpenter(false);
                  selectsetCarpenter(selectedOption);
                }
              }}
            />
            <p className="font-bold color">Shop Name</p>
            <Select
              isMulti
              className="md:w-full w-72"
              options={[
                { label: "Create New Shop", value: "create" },
                ...(shop.map((name) => ({
                  label: name.shopName,
                  value: name._id,
                })) || []),
              ]}
              value={selectShop}
              onChange={(selectedOption) => {
                if (
                  selectedOption.some((option) => option.value === "create")
                ) {
                  setIsCreatingShop(true);
                  selectsetShop([]);
                } else {
                  setIsCreatingShop(false);
                  selectsetShop(selectedOption);
                }
              }}/>
            <p className="font-bold color">Sales Person</p>
            <Select
              className="md:w-full w-72"
              options={sale.map((name) => ({
                label: name.Name,
                value: name._id,
              }))}
              value={selectSale}
              onChange={(selectedOption) => {
                selectsetSale(selectedOption);
              }}
            />
            <div className="mx-auto">
              <button
                type="submit"
                className="btn mt-3 n-color md:py-1 text-white w-full"
              >
                Submit
              </button>
            </div>
          </Form>
        </div>
      </Container>
      <Modal show={modalState.showModal} onHide={handleClose}>
  <Modal.Body className={modalState.isSuccess ? "modal-success" : "modal-error"}>
    {modalState.message}
  </Modal.Body>
</Modal>

      {isCreatingArchitecture ? (
        <Modal
          show={isCreatingArchitecture}
          onHide={handleCloseCreateArchitecture}
        >
          <Modal.Body className="bg-white rounded-lg">
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold color">
                  Architec Name <span className="text-red-600"> &#8727; </span> :
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Architec Name"
                  value={newArchitecture.name}
                  onChange={(e) =>
                    setNewArchitecture({
                      ...newArchitecture,
                      name: e.target.value,
                    })
                  } />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold color">
                  Mobile No. <span className="text-red-600"> &#8727; </span> :
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Mobile No."
                  value={newArchitecture.mobileNo}
                  onChange={(e) =>
                    setNewArchitecture({
                      ...newArchitecture,
                      mobileNo: e.target.value,
                    })
                  } />    
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold color">Address:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={newArchitecture.address}
                  onChange={(e) =>
                    setNewArchitecture({
                      ...newArchitecture,
                      address: e.target.value,
                    })
                  }/>
              </Form.Group>
            </Form>
            <div className="flex justify-center">
              <button
                onClick={handleSaveNewArchitecture}
                className="border-1 n-color text-white px-3 py-2 rounded-md " >
                Create
              </button>
            </div>
          </Modal.Body>
        </Modal>
      ) : null}

      {isCreatingCarpenter ? (
        <Modal show={isCreatingCarpenter} onHide={handleCloseCreateCarpenter}>
          <Modal.Body className="bg-white rounded-lg">
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold color">
                  Carpenter Name <span className="text-red-600"> &#8727; </span>
                  :
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Carpenter Name"
                  value={newCarpenter.name}
                  onChange={(e) =>
                    setNewCarpenter({
                      ...newCarpenter,
                      name: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold color">
                  Mobile No.
                  <span className="text-red-600"> &#8727; </span>:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Mobile No."
                  value={newCarpenter.mobileNo}
                  onChange={(e) =>
                    setNewCarpenter({
                      ...newCarpenter,
                      mobileNo: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold color">Address:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={newCarpenter.address}
                  onChange={(e) =>
                    setNewCarpenter({
                      ...newCarpenter,
                      address: e.target.value,
                    })
                  } />
              </Form.Group>
            </Form>
            <div className="flex justify-center">
              <button
                onClick={handleSaveNewCarpenter}
                className="border-1 n-color text-white px-3 py-2 rounded-md " >
                Create
              </button>
            </div>
          </Modal.Body>
        </Modal>
      ) : null}

      {isCreatingShop ? (
        <Modal show={isCreatingShop} onHide={handleCloseCreateShop}>
          <Modal.Body className="bg-white rounded-lg">
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold color">
                  Shop Name <span className="text-red-600"> &#8727; </span>:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Shop Name"
                  value={newShop.name}
                  onChange={(e) =>
                    setNewShop({
                      ...newShop,
                      name: e.target.value,
                    })
                  } />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold color">
                  Mobile No.
                  <span className="text-red-600"> &#8727; </span>:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Mobile No."
                  value={newShop.mobileNo}
                  onChange={(e) =>
                    setNewShop({
                      ...newShop,
                      mobileNo: e.target.value,
                    })
                  } />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold color">Address:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={newShop.address}
                  onChange={(e) =>
                    setNewShop({
                      ...newShop,
                      address: e.target.value,
                    })
                  } />
              </Form.Group>
            </Form>
            <div className="flex justify-center">
              <button
                onClick={handleSaveNewShop}
                className="border-1 n-color text-white px-3 py-2 rounded-md" >
                Create
              </button>
            </div>
          </Modal.Body>
        </Modal>
      ) : null}
    </>
  );
}
export default QuotationForm;
