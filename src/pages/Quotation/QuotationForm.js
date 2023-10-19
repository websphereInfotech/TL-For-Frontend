import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import Select from "react-select";
import { Breadcrumb, Container, Form } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";
import { AiOutlinePlusCircle } from "react-icons/ai";
let url = process.env.REACT_APP_BASEURL
function QuotationForm() {
  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    userName: "",
    mobileNo: "",
    address: "",
    Date: "",
  });
  const [rows, setRows] = useState([
    {
      description: "",
      area: "",
      size: "0",
      rate: "0",
      quantity: "0",
      total: "0",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [architecture, setArchitecture] = useState([]);
  const [selectedArchitecture, setSelectedArchitecture] = useState([]);
  const [carpenter, setCarpenter] = useState([]);
  const [selectCarpenter, selectsetCarpenter] = useState([]);
  const [shop, setShop] = useState([]);
  const [selectShop, selectsetShop] = useState([]);
  const [sale, setSale] = useState([]);
  const [selectSale, selectsetSale] = useState(null);
  const [serialNub, setSerialNub] = useState(1);

  const [isCreatingArchitecture, setIsCreatingArchitecture] = useState(false);
  const [newArchitecture, setNewArchitecture] = useState({
    name: "",
    mobileNo: "",
    address: "",
  });
  const addRowTable = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        description: "",
        area: "",
        size: "0",
        rate: "0",
        quantity: "0",
        total: "0",
      },
    ]);
  };
  const handleRowChange = (rowIndex, field, value) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[rowIndex][field] = value;

      const size = parseFloat(newRows[rowIndex].size) || 0;
      const rate = parseFloat(newRows[rowIndex].rate) || 0;
      const quantity = parseFloat(newRows[rowIndex].quantity) || 0;

      newRows[rowIndex].total = (size * rate * quantity).toFixed(2);

      return newRows;
    });
  };

  const [isCreatingCarpenter, setIsCreatingCarpenter] = useState(false);
  const [newCarpenter, setNewCarpenter] = useState({
    name: "",
    mobileNo: "",
    address: "",
  });
  const [isCreatingShop, setIsCreatingShop] = useState(false);
  const [newShop, setNewShop] = useState({
    name: "",
    mobileNo: "",
    address: "",
  });
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
          const { serialNumber = 0 } = res?.[res.length - 1] || {};
          setSerialNub(serialNumber + 1);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    async function fetchData() {
      try {
        const timestamp = Date.now();
        const architectureResponse = await axios.get(
          `${url}/architec/list?timestamp=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
        const carpenterResponse = await axios.get(
          `${url}/carpenter/list?timestamp=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
        const shopResponse = await axios.get(
          `${url}/shop/list?timestamp=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
        const saleResponse = await axios.get(
          `${url}/salesPerson/AllList?timestamp=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
        setArchitecture(architectureResponse.data.data);
        setCarpenter(carpenterResponse.data.data);
        setShop(shopResponse.data.data);
        setSale(saleResponse.data.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
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
          const quotationData = response.data.data1 || {};
          const timestamp = new Date(quotationData.Date);
          const formattedDate = timestamp.toISOString().split("T")[0];

          const tableData = response.data.data || [];
          console.log(quotationData.Date);
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
        })
        .catch(function (error) {
          console.log(error);
          setMessage(error.response.data.message);
          setShowModal(true);
        });
    }
  }, [id]);

  const handleQuotation = (e) => {
    e.preventDefault();

    const allFieldsEmpty = Object.values(formValues).every(
      (value) => value === ""
    );
    if (allFieldsEmpty) {
      setMessage("Please Fill Required Fields");
      setShowModal(true);
      return;
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
      if (id) {
        axios
          .put(`${url}/quotation/update/${id}`, data, {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          })
          .then(function (response) {
            if (response.data && response.data.status === "Success") {
              console.log("usersbhjabj", response.data);
              setShowModal(true);
              setMessage("Quotation Update successful");
            } else {
              setMessage(response.data.message);
              setShowModal(true);
            }
          })
          .catch(function (error) {
            console.log(error);
            setMessage(error.response.data.message);
            setShowModal(true);
          });
      } else {
        axios
          .post(`${url}/quotation/cerate`, data, {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          })
          .then(function (response) {
            if (response.data && response.data.status === "Success") {
              setShowModal(true);
              setMessage("Quotation Create successful");
            } else {
              setMessage(response.data.message);
              setShowModal(true);
            }
          })
          .catch(function (error) {
            console.log(error);
            setMessage(error.response.data.message);
            setShowModal(true);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = useCallback(() => {
    setShowModal(false);
    if (
      message &&
      (message.includes("Quotation Create successful") ||
        message.includes("Quotation Update successful"))
    ) {
      navigate(routeUrls.DASHBOARD);
    }
  }, [message, navigate]);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showModal, handleClose]);

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
          setMessage("Architecture Create successful");
          setShowModal(true);
          const newArchOption = {
            label: newArchitecture.name,
            value: response.data.architectureId,
          };
          setSelectedArchitecture([newArchOption]);
        } else {
          setMessage(response.data.message);
          setShowModal(true);
        }
      })
      .catch(function (error) {
        console.log(error);
        setMessage(error.response.data.message);
        setShowModal(true);
      });
  };
  const handleCloseCreateArchitecture = () => {
    setIsCreatingArchitecture(false);
  };
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
          setMessage("Carpenter Create successful");
          setShowModal(true);
          const newCarpOption = {
            label: newCarpenter.name,
            value: response.data.carpenterId,
          };
          selectsetCarpenter([newCarpOption]);
        } else {
          setMessage(response.data.message);
          setShowModal(true);
        }
      })
      .catch(function (error) {
        console.log(error);
        setMessage(error.response.data.message);
        setShowModal(true);
      });
  };
  const handleCloseCreateCarpenter = () => {
    setIsCreatingCarpenter(false);
  };
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
          setMessage("Shop Create successful");
          setShowModal(true);
          const newShopOption = {
            label: newShop.name,
            value: response.data.shopId,
          };
          selectsetShop([newShopOption]);
        } else {
          setMessage(response.data.message);
          setShowModal(true);
        }
      })
      .catch(function (error) {
        console.log(error);
        setMessage(error.response.data.message);
        setShowModal(true);
      });
  };
  const handleCloseCreateShop = () => {
    setIsCreatingShop(false);
  };
  return (
    <>
      <Header />
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
            linkProps={{ to: routeUrls.QUOTATION }}
          >
            Quotation
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <p className="md:text-4xl text-2xl font-bold text-center mb-3">
        {id ? "Update QuotationForm" : "Create QuotationForm"}
      </p>
      <Container>
        <div>
          <Form className="w-50 sm:mx-auto " onSubmit={handleQuotation}>
            <div className="md:flex justify-between flex-none">
              <Form.Group
                className=" mb-3 md:w-72 w-72"
                controlId="formBasicEmail"
              >
                <Form.Label className="font-bold">
                  Token No.
                  <span className="text-red-600"> &#8727; </span>:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Token No. :"
                  value={serialNub}
                />
              </Form.Group>
              <Form.Group
                className="mb-3 md:w-72 w-72"
                controlId="formBasicEmail"
              >
                <Form.Label className="font-bold">
                  Date
                  <span className="text-red-600"> &#8727; </span>:
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
                <Form.Label className="font-bold">
                  Name
                  <span className="text-red-600"> &#8727; </span>:
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
                <Form.Label className="font-bold">
                  Mobile No.
                  <span className="text-red-600"> &#8727; </span>:
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
              <Form.Label className="font-bold">
                Address
                <span className="text-red-600"> &#8727; </span>:
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
                    <th>Description</th>
                    <th>Area</th>
                    <th>Size</th>
                    <th>Rate</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>
                      <button type="button" className="" onClick={addRowTable}>
                        <AiOutlinePlusCircle />
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
                              handleRowChange(
                                rowIndex,
                                "description",
                                e.target.value
                              )
                            }
                            name=""
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.area || ""}
                            onChange={(e) =>
                              handleRowChange(rowIndex, "area", e.target.value)
                            }
                            name="Area"
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.size || ""}
                            onChange={(e) =>
                              handleRowChange(rowIndex, "size", e.target.value)
                            }
                            name="Size"
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.rate || ""}
                            onChange={(e) =>
                              handleRowChange(rowIndex, "rate", e.target.value)
                            }
                            name="Quantity"
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.quantity || ""}
                            onChange={(e) =>
                              handleRowChange(
                                rowIndex,
                                "quantity",
                                e.target.value
                              )
                            }
                            name="Quantity"
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.total || ""}
                            onChange={(e) =>
                              handleRowChange(rowIndex, "total", e.target.value)
                            }
                            name="Total"
                            className="form-control"
                          />
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
                              total + (parseFloat(row.total) || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </>
              </table>
            </div>
            <p className="font-bold">Architec Name</p>
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
                console.log("???????????????", selectedOption);
                console.log("???????????????", selectedArchitecture);
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
            <p className="font-bold">Carpenter Name</p>
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
            <p className="font-bold">Shop Name</p>
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
              }}
            />
            <p className="font-bold">Sales Person</p>
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
                className="btn mt-3 bg-black text-white w-full"
              >
                Submit
              </button>
            </div>
          </Form>
        </div>
      </Container>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Body
          className={
            message.includes("successful") ? "modal-success" : "modal-error"
          }
        >
          {message}
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
                <Form.Label className="font-bold">
                  Architec Name <span className="text-red-600"> &#8727; </span>{" "}
                  :
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
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold">
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
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold">Address:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={newArchitecture.address}
                  onChange={(e) =>
                    setNewArchitecture({
                      ...newArchitecture,
                      address: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
            <div className="flex justify-center">
              <button
                onClick={handleSaveNewArchitecture}
                className="border-1 bg-black text-white px-3 py-2 rounded-md "
              >
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
                <Form.Label className="font-bold">
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
                <Form.Label className="font-bold">
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
                <Form.Label className="font-bold">Address:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={newCarpenter.address}
                  onChange={(e) =>
                    setNewCarpenter({
                      ...newCarpenter,
                      address: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
            <div className="flex justify-center">
              <button
                onClick={handleSaveNewCarpenter}
                className="border-1 bg-black text-white px-3 py-2 rounded-md "
              >
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
                <Form.Label className="font-bold">
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
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold">
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
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-bold">Address:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={newShop.address}
                  onChange={(e) =>
                    setNewShop({
                      ...newShop,
                      address: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
            <div className="flex justify-center">
              <button
                onClick={handleSaveNewShop}
                className="border-1 bg-black text-white px-3 py-2 rounded-md"
              >
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