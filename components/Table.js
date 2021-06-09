import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Popconfirm, Form } from "antd";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};



const expandedRow = (dailyData, handleDelete) => {
  const columns = [
    {
      title: "id",
      dataIndex: "uid",
    },
    { title: 'Día', 
      dataIndex: 'date', 
      editable: true 
    },
    { title: 'Tipo de cultivo', 
      dataIndex: 'crop_type', 
      editable: true 
    },
    { title: 'Kilos', 
      dataIndex: 'yield_values', 
      editable: true 
    },
    {
      title: "Operación",
      dataIndex: "operation",
      render: (_, record) =>
        <Popconfirm
          title="¿Está seguro?"
          onConfirm={() => handleDelete(record.uid)}
        >
          <a>Delete</a>
        </Popconfirm>
    },
  ];

  const data = [];
  for (let i = 0; i < dailyData.length; ++i) {
    data.push({
      uid: dailyData[i].uid,
      date: dailyData[i].date,
      crop_type: dailyData[i].crop_type,
      yield_values: dailyData[i].yield_values,
    });
  }
  return <Table columns={columns} dataSource={data} />;
};



const EditableTable = () => {
  const tableColumns = [
    {
      title: "id",
      dataIndex: "uid",
    },
    {
      title: "Fecha",
      dataIndex: "date",
      editable: true,
    },
    {
      title: "Tipo de cultivo",
      dataIndex: "crop_type",
      editable: true,
    },
    {
      title: "Kilos",
      dataIndex: "yield_values",
      editable: true,
    },
  ];
  const [state, setState] = useState({
    monthlyData: [
      {
        uid: 1,
        date: "2010-10",
        crop_type: "Mango Keitt",
        yield_values: 14,
      },
      {
        uid: 2,
        date: "2013-10",
        crop_type: "Mango Tommy Atkins",
        yield_values: 9,
      },
    ],
    dailyData: [
      {
        uid: 1,
        date: "2010-10-14",
        crop_type: "Mango Keitt",
        yield_values: 9,
      },
      {
        uid: 2,
        date: "2010-10-23",
        crop_type: "Mango Keitt",
        yield_values: 5,
      },
      {
        uid: 3,
        date: "2013-10-01",
        crop_type: "Mango Tommy Atkins",
        yield_values: 4,
      },
      {
        uid: 4,
        date: "2013-10-10",
        crop_type: "Mango Tommy Atkins",
        yield_values: 5,
      },
    ],
    count: 4,
  });

  const handleDelete = (uid) => {
    const { count, dataSource } = state;
    setState({
      dataSource: dataSource.filter((item) => item.uid !== uid),
      count: count - 1,
    });
  };

  const handleAdd = () => {
    const { count, dataSource } = state;
    const newData = {
      uid: count + 1,
      date: "",
      crop_type: "",
      yield_values: 0,
    };
    setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  const handleSaveCell = (row) => {
    const newData = [...state.dataSource];
    const index = newData.findIndex((item) => row.uid === item.uid);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setState({
      dataSource: newData,
    });
  };

  const handleSaveToDB = () => {
    // TODO
  };

  const dataSourceMontly = state.monthlyData;
  const dataSourceDaily = expandedRow(state.dailyData, handleDelete);
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = tableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSaveCell,
      }),
    };
  });

  return (
    <>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Añadir una entrada
      </Button>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        expandable={{ dataSourceDaily }}
        dataSource={dataSourceMontly}
        columns={columns}
      />
    </>
  );
};

export default EditableTable;