import React, { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import Select from "react-select";
import { Breadcrumb, Container, Form } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import routeUrls from "../../constants/routeUrls";

function QuotationForm() {
  const { id } = useParams();
  const [formValues, setFormValues] = useState({
    userName: "",
    mobileNo: "",
    address: "",
    rate: "",
    description: "",
    quantity: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [architecture, setArchitecture] = useState([]);
  const [selectedArchitecture, setSelectedArchitecture] = useState([]);
  const [carpenter, setCarpenter] = useState([]);
  const [selectCarpenter, selectsetCarpenter] = useState([]);
  const [shop, setShop] = useState([]);
  const [selectShop, selectsetShop] = useState([]);
  const [serialNub, setSerialNub] = useState(1);

  const setParameter = (id) => {
    console.log("Selected ID:", id);
  };
  useEffect(() => {
    const saved = localStorage.getItem(process.env.REACT_APP_KEY);
    axios
      .get(`http://localhost:2002/api/quotation/listdata`, {
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
          `http://localhost:2002/api/architec/list?timestamp=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
        const carpenterResponse = await axios.get(
          `http://localhost:2002/api/carpenter/list?timestamp=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
        const shopResponse = await axios.get(
          `http://localhost:2002/api/shop/list?timestamp=${timestamp}`,
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        );
        setArchitecture(architectureResponse.data.data);
        setCarpenter(carpenterResponse.data.data);
        setShop(shopResponse.data.data);
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
        .get(`http://localhost:2002/api/quotation/viewdata/${id}`, {
          headers: {
            Authorization: `Bearer ${saved}`,
          },
        })
        .then(function (response) {
          const quotationData = response.data.data;
          console.log("Quotation Data:", quotationData);
          setFormValues({
            userName: quotationData.userName,
            mobileNo: quotationData.mobileNo,
            address: quotationData.address,
            serialNumber: quotationData.serialNumber,
            rate: quotationData.rate,
            description: quotationData.description,
            quantity: quotationData.quantity,
          });
          const architectureData = quotationData.architecture
            ? quotationData.architecture
                .split(", ")
                .map((name) => ({ label: name, value: name }))
            : [];
          const carpenterData = quotationData.carpenter
            ? quotationData.carpenter
                .split(", ")
                .map((name) => ({ label: name, value: name }))
            : [];
          const shopData = quotationData.shop
            ? quotationData.shop
                .split(", ")
                .map((name) => ({ label: name, value: name }))
            : [];

          setSelectedArchitecture(architectureData);
          selectsetCarpenter(carpenterData);
          selectsetShop(shopData);
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
    const architectureIds = selectedArchitecture
      .map((item) => item.value)
      .join(", ");
    const carpenterIds = selectCarpenter.map((item) => item.value).join(", ");
    const shopIds = selectShop.map((item) => item.value).join(", ");
    if (id) {
      axios
        .put(
          `http://localhost:2002/api/quotation/update/${id}`,
          {
            ...formValues,
            ...(formValues.serialNumber
              ? { serialNumber: formValues.serialNumber.toString() }
              : {}),
            rate: formValues.rate.toString(),
            quantity: formValues.quantity.toString(),
            architecture: architectureIds,
            carpenter: carpenterIds,
            shop: shopIds,
          },
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        )
        .then(function (response) {
          if (response.data && response.data.status === "Success") {
            setMessage("Quotation  Update successful");
            setShowModal(true);
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
        .post(
          `http://localhost:2002/api/quotation/cerate`,
          {
            ...formValues,
            serialNumber: serialNub.toString(),
            architecture: architectureIds,
            carpenter: carpenterIds,
            shop: shopIds,
          },
          {
            headers: {
              Authorization: `Bearer ${saved}`,
            },
          }
        )
        .then(function (response) {
          if (response.data && response.data.status === "Success") {
            setMessage("Quotation  Create successful");
            setShowModal(true);
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
  };
  const handleClose = useCallback(() => {
    setShowModal(false);
    if (message.includes("successful")) {
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
        <Form className="w-50 mx-auto" onSubmit={handleQuotation}>
        {!id && (
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="font-bold">
                Token No.
                <span className="text-red-600"> &#8727; </span>:
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Sr No. :"
                value={serialNub}
                readOnly
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3" controlId="formBasicEmail">
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
          <Form.Group className="mb-3" controlId="formBasicPassword">
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
          <Form.Group className="mb-3" controlId="formBasicPassword">
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
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="font-bold">
              Description
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Description :"
              style={{ height: "100px" }}
              value={formValues.description}
              onChange={(e) =>
                setFormValues({ ...formValues, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="font-bold">
              Quantity
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Quantity :"
              value={formValues.quantity}
              onChange={(e) =>
                setFormValues({ ...formValues, quantity: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="font-bold">
              Rate
              <span className="text-red-600"> &#8727; </span>:
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Rate :"
              value={formValues.rate}
              onChange={(e) =>
                setFormValues({ ...formValues, rate: e.target.value })
              }
            />
          </Form.Group>
          <p className="font-bold">Architecture Name</p>
          <Select
            isMulti
            options={architecture.map((name) => ({
              label: name.architecsName,
              value: name._id,
            }))}
            value={selectedArchitecture}
            onChange={(selectedOption) => {
              const selectedId = selectedOption ? selectedOption.value : null;
              console.log("Selectedssss ID:", selectedArchitecture);
              setParameter(selectedId);
              setSelectedArchitecture(selectedOption);
              console.log(selectedOption);
            }}
          />
          <p className="font-bold">Carpenter Name</p>
           <Select
            isMulti
            options={carpenter.map((name) => ({
              label: name.carpentersName,
              value: name._id,
            }))}
            value={selectCarpenter}
            onChange={(selectedOption) => {
              selectsetCarpenter(selectedOption);
            }}
            />
          <p className="font-bold">Shop Name</p>
          <Select
            isMulti
            options={shop.map((name) => ({
              label: name.shopName,
              value: name._id,
            }))}
            value={selectShop}
            onChange={(selectedOption) => {
              selectsetShop(selectedOption);
            }}
            />
          <button type="submit" className="btn mt-3 bg-black text-white w-full">
            Submit
          </button>
        </Form>
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
    </>
  );
}
export default QuotationForm;
