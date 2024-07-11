/* eslint-disable react/prop-types */
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import "./Bill.css";
import dayjs from "dayjs";

export function Bill() {
  const stayNames = [
    { label: "Benny Stay", value: "bennyStay" },
    { label: "Albert Stay", value: "AlbertStay" },
  ];
  const bookingOptions = [
    { label: "Walk In", value: "walkin" },
    { label: "Online", value: "Online" },
  ];
  const fields = [
    {
      name: "Income From (Stay Name)",
      type: "dropDown",
      value: "",
      container: "bookingInfo",
      options: stayNames,
    },
    {
      name: "Date Of Booking",
      type: "datePicker",
      value: dayjs(),
      container: "bookingInfo",
    },
    {
      name: "Booking From",
      type: "dropDown",
      value: "",
      container: "bookingInfo",
      options: bookingOptions,
    },
    {
      name: "Room No",
      type: "text",
      value: "",
      container: "bookingInfo",
    },
    {
      name: "Share Percentage",
      type: "text",
      value: null,
      convertToNumber: true,
      container: "bookingInfo",
    },
    {
      name: "Adavance Amount",
      type: "text",
      convertToNumber: true,
      value: null,
      container: "income",
    },

    {
      name: "Extra Amount",
      type: "text",
      convertToNumber: true,
      value: null,
      container: "income",
    },

    {
      name: "Extra Amount Detail",
      type: "text",
      value: "",
      container: "income",
    },
    {
      name: "Balance Amount",
      type: "text",
      convertToNumber: true,
      value: null,
      container: "income",
    },
    {
      name: "Expenses",
      type: "text",
      convertToNumber: true,
      value: null,
      container: "expense",
    },
    {
      name: "Expenses Explanation",
      type: "text",
      value: "",
      container: "expense",
    },
    {
      name: "Amount Debited from",
      type: "dropDown",
      value: "",
      container: "accountInfo",
    },
    {
      name: "Debited Amount",
      type: "text",
      convertToNumber: true,
      value: null,
      container: "accountInfo",
    },

    {
      name: "Amount Credited to",
      type: "dropDown",
      value: "",
      container: "accountInfo",
    },
    {
      name: "Credited Amount ",
      type: "text",
      convertToNumber: true,
      value: null,
      container: "accountInfo",
    },
    {
      name: "Amount Received As (Rs / Euro)",
      type: "dropDown",
      value: null,
      container: "calculation",
    },
    {
      name: "Is GST Included",
      type: "radio",
      value: true,
      container: "calculation",
    },
    {
      name: "GST Percentage",
      type: "text",
      convertToNumber: true,
      value: null,
      container: "calculation",
    },
    {
      name: "Final Amount",
      type: "text",
      convertToNumber: true,
      readOnly: true,
      value: "",
      disabled: true,
      container: "calculation",
    },
  ];
  const [formFields, setFiledProps] = useState(fields);

  const handleSubmit = async () => {
    console.log(formFields);

    const apiBody = formFields
      .map((item) => ({
        ...item,
        value: item.convertToNumber ? Number(item.value) : item.value,
      }))
      .reduce((prev, curr) => {
        return { ...prev, [curr.name]: curr.value };
      }, {});

    try {
      const response = await fetch("http://localhost:3000/bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiBody),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const totalIncome = formFields
    .filter(
      (item) => item.container === "income" && item.convertToNumber === true
    )
    .reduce(function (acc, obj) {
      return acc + obj.value;
    }, 0);

  const totalExpenses = formFields
    .filter((item) => item.name === "Expenses" && item.convertToNumber === true)
    .reduce(function (acc, obj) {
      return acc + obj.value;
    }, 0);

  const handleChangeInFileds = (e, name) => {
    setFiledProps((prev) => {
      return prev.map((d) => ({ ...d, value: d.name === name ? e : d.value }));
    });
  };
  const handleCalculate = () => {
    const isGstPercentageFiledEnabled = formFields.find(
      (itm) => itm.name === "Is GST Included"
    ).value;
    const isGstPercentage = formFields.find(
      (itm) => itm.name === "GST Percentage"
    ).value;
    const taxcalculted =
      (totalIncome - totalExpenses) * (isGstPercentage / 100);
    const totalGain =
      !isGstPercentageFiledEnabled || isGstPercentage === 0
        ? totalIncome - totalExpenses
        : totalIncome - totalExpenses - taxcalculted;
    setFiledProps((prev) => {
      return prev.map((d) => ({
        ...d,
        value: d.name === "Final Amount" ? totalGain : d.value,
      }));
    });
  };
  return (
    <div className="bill_container">
      <div className="bill_container_title">Create Entry</div>

      <div className="bill_container_section">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="bill_container_divider_container"
        >
          <div className="bill_container_divider_title">Booking Details</div>
        </Divider>
        <Row justify="start" gutter={[16, 24]}>
          {formFields
            .filter((itm) => itm?.container === "bookingInfo")
            .map((field) => {
              return (
                <Col span={6} key={field.name}>
                  <div className="bill_form_field_label">{field.name}</div>
                  <div>
                    {
                      <RenderFiled
                        field={field}
                        handleChangeInFileds={handleChangeInFileds}
                      />
                    }
                  </div>
                </Col>
              );
            })}
        </Row>
      </div>
      <div className="bill_container_section">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="bill_container_divider_container"
        >
          <div className="bill_container_divider_title">Income Details</div>
        </Divider>
        <Row justify="start" gutter={[16, 24]}>
          {formFields
            .filter((itm) => itm?.container === "income")
            .map((field) => {
              return (
                <Col span={6} key={field.name}>
                  <div className="bill_form_field_label">{field.name}</div>
                  <div>
                    {
                      <RenderFiled
                        field={field}
                        handleChangeInFileds={handleChangeInFileds}
                      />
                    }
                  </div>
                </Col>
              );
            })}
        </Row>
      </div>
      <div className="bill_container_section">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="bill_container_divider_container"
        >
          <div className="bill_container_divider_title">Expense Details</div>
        </Divider>
        <Row justify="start" gutter={[16, 24]}>
          {formFields
            .filter((itm) => itm?.container === "expense")
            .map((field) => {
              return (
                <Col span={6} key={field.name}>
                  <div className="bill_form_field_label">{field.name}</div>
                  <div>
                    {
                      <RenderFiled
                        field={field}
                        handleChangeInFileds={handleChangeInFileds}
                      />
                    }
                  </div>
                </Col>
              );
            })}
        </Row>
      </div>
      <div className="bill_container_section">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="bill_container_divider_container"
        >
          <div className="bill_container_divider_title">Account Details</div>
        </Divider>
        <Row justify="start" gutter={[16, 24]}>
          {formFields
            .filter((itm) => itm?.container === "accountInfo")
            .map((field) => {
              return (
                <Col span={6} key={field.name}>
                  <div className="bill_form_field_label">{field.name}</div>
                  <div>
                    {
                      <RenderFiled
                        field={field}
                        handleChangeInFileds={handleChangeInFileds}
                      />
                    }
                  </div>
                </Col>
              );
            })}
        </Row>
      </div>
      <div className="bill_container_section">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="bill_container_divider_container"
        >
          <div className="bill_container_divider_title">
            Calculation Details
          </div>
        </Divider>
        <Row justify="start" align="bottom" gutter={[16, 24]}>
          {formFields
            .filter((itm) => itm?.container === "calculation")
            .map((field) => {
              return (
                <>
                  <Col span={6} key={field.name}>
                    <div className="bill_form_field_label">{field.name}</div>
                    <div>
                      {
                        <RenderFiled
                          field={field}
                          handleChangeInFileds={handleChangeInFileds}
                        />
                      }
                    </div>
                  </Col>
                </>
              );
            })}
          <div>
            <Row justify="start" align="bottom" gutter={[16, 24]}>
              <Col>
                <Button type="primary" onClick={handleCalculate}>
                  Calculate
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Col>
            </Row>
          </div>
        </Row>
      </div>
    </div>
  );
}

const RenderFiled = ({ field, handleChangeInFileds }) => {
  const style = {
    width: "100%",
  };
  switch (field.type) {
    case "dropDown": {
      return (
        <Select
          options={field.options}
          onSelect={(e) => {
            handleChangeInFileds(e, field.name);
          }}
          style={style}
          placeholder={`Select ${field.name}`}
        />
      );
    }
    case "text": {
      return (
        <Input
          placeholder={`Enter ${field.name}`}
          onChange={(e) => {
            if (field.convertToNumber && isNaN(e.target.value)) {
              alert("enter only number");
            } else if (
              field.convertToNumber &&
              !isNaN(e.target.value) &&
              e.target.value.length > 0
            ) {
              handleChangeInFileds(parseFloat(e.target.value), e.target.name);
            } else {
              console.log(e.target.value);
              handleChangeInFileds(e.target.value, e.target.name);
            }
          }}
          value={field.value}
          name={field.name}
          style={style}
          disabled={Boolean(field.disabled)}
        />
      );
    }
    case "number": {
      return (
        <InputNumber
          placeholder={`Enter ${field.name}`}
          name={field.name}
          // onChange={(e) => {
          //   handleChangeInFileds(e.target.value, e.target.name);
          // }}
          style={style}
        />
      );
    }
    case "datePicker": {
      return (
        <DatePicker
          placeholder={`Select ${field.name}`}
          onChange={(_date, dateString) =>
            handleChangeInFileds(dateString, field.name)
          }
          value={dayjs(field.value, "YYYY-MM-DD")}
          style={style}
        />
      );
    }
    case "radio": {
      return (
        <Radio.Group
          name={field.name}
          onChange={(e) => {
            handleChangeInFileds(e.target.value, e.target.name);
          }}
          value={field.value}
        >
          <Radio value={true}>Yes</Radio>
          <Radio value={false}>No</Radio>
        </Radio.Group>
      );
    }
  }
};
