import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export function Dashboard() {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const columns = [
    {
      title: "Income From (Stay Name)",
      dataIndex: "Income From (Stay Name)",
      key: "Income From (Stay Name)",
    },
    {
      title: "Date Of Booking",
      dataIndex: "Date Of Booking",
      key: "Date Of Booking",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Booking From",
      dataIndex: "Booking From",
      key: "Booking From",
    },
    {
      title: "Room No",
      dataIndex: "Room No",
      key: "Room No",
    },
    {
      title: "Share Percentage",
      dataIndex: "Share Percentage",
      key: "Share Percentage",
    },
    {
      title: "Adavance Amount",
      dataIndex: "Adavance Amount",
      key: "Adavance Amount",
    },
    {
      title: "Extra Amount",
      dataIndex: "Extra Amount",
      key: "Extra Amount",
    },
    {
      title: "Extra Amount Detail",
      dataIndex: "Extra Amount Detail",
      key: "Extra Amount Detail",
    },
    {
      title: "Expenses",
      dataIndex: "Expenses",
      key: "Expenses",
    },
    {
      title: "Debited Amount",
      dataIndex: "Debited Amount",
      key: "Debited Amount",
    },
    {
      title: "Amount Credited to",
      dataIndex: "Amount Credited to",
      key: "Amount Credited to",
    },
    {
      title: "Amount Received As (Rs / Euro)",
      dataIndex: "Amount Received As (Rs / Euro)",
      key: "Amount Received As (Rs / Euro)",
    },
    {
      title: "Is GST Included",
      dataIndex: "Is GST Included",
      key: "Is GST Included",
    },
    {
      title: "GST Percentage",
      dataIndex: "GST Percentage",
      key: "GST Percentage",
    },
    {
      title: "Final Amount",
      dataIndex: "Final Amount",
      key: "Final Amount",
    },
  ];
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/bill");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);
  console.log(items);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(items.items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${"fileName"}.xlsx`);
  };
  return (
    <div>
      <Button onClick={handleExport}>Click</Button>{" "}
      <Table dataSource={items.items} columns={columns} rowKey="_id" />
      <h3>Total Final Amount: {items.totalFinalAmount}</h3>
    </div>
  );
}
