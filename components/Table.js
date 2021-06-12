import React, { useState } from "react";
import { Table, Input, Typography, Popconfirm, Form, Button, Divider, Row, Col } from "antd";
import { MinusOutlined } from "@ant-design/icons"

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Introduzca ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();

  // let n = (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 8);
  // fetchData = () => {
  //   adalApiFetch(fetch, "/Tenant", {})
  //     .then(response => response.json())
  //     .then(responseJson => {
  //       if (!this.isCancelled) {
  //           const results= responseJson.map(row => ({
  //               ClientId: row.ClientId,
  //               ClientSecret: row.ClientSecret,
  //               Id: row.Id,
  //               SiteCollectionTestUrl: row.SiteCollectionTestUrl,
  //               TenantDomainUrl: row.TenantDomainUrl
  //             }))
  //         this.setState({ data: results });
  //       }
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // };

  // The parent's keys shoud be equal to their corresponding date.
  // The children's keys should be equal to their corresponding uid.
  // https://stackoverflow.com/a/29813867/15612571
  const [data, setData] = useState(
    [
      {
        key: "2010-10",
        date: "2010-10",
        crop_type: "Mango Keitt",
        yield_values: 14,
        children: [
          {
            key: 1,
            uid: 1,
            date: "2010-10-14",
            crop_type: "Mango Keitt",
            yield_values: 9,
          },
          {
            key: 2,
            uid: 2,
            date: "2010-10-23",
            crop_type: "Mango Keitt",
            yield_values: 5,
          },          
        ]
      },
      {
        key: 15,
        date: "2013-10",
        crop_type: "Mango Tommy Atkins",
        yield_values: 9,
        children: [
          {
            key: 3,
            uid: 3,
            date: "2013-10-01",
            crop_type: "Mango Tommy Atkins",
            yield_values: 4,
          },
          {
            key: 4,
            uid: 4,
            date: "2013-10-10",
            crop_type: "Mango Tommy Atkins",
            yield_values: 5,
          },          
        ]
      },
    ],
  );

  const [modifiedRows, setModifiedRows] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    console.log(modifiedRows);
    form.setFieldsValue({
      date: '',
      crop_type: '',
      yield_values: '',
      ...record,
    });

    // The current row being edited is set by its key
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const handleAdd = () => {
    const newData = [...data];
    const id = (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 8);
    const newRow = {
      key: id,
      uid: id,
      date: "",
      crop_type: "",
      yield_values: "",
    };
    
    setModifiedRows(modifiedRows.concat(newRow));

    newData.push(newRow);
    setData(newData);
  };

  const handleDelete = (key) => {
    var newData = [...data];
    const rowToDelete = newData.findIndex((item) => item.key === key);

    if (rowToDelete != -1){
      setDeletedRows(deletedRows.concat(newData[rowToDelete]));
      newData = newData.filter((item) => item.key !== key);
      setData(newData);
    } else {
      const index = newData.findIndex((item) => item.children.findIndex((child) => key === child.key) > -1);
      const indexChild = newData[index].children.findIndex((child) => key === child.key);
      setDeletedRows(deletedRows.concat(newData[index].children[indexChild]));
      newData[index].children.splice(indexChild, 1);
      setData(newData);
    }
    
  };

  const handleSave = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const rowToSave = newData.findIndex((item) => item.key === key);
      
      if (rowToSave != -1){
        newData.splice(rowToSave, 1, {...newData[rowToSave], ...row});
        setModifiedRows(modifiedRows.concat(newData[rowToSave]));
      } else {
        const index = newData.findIndex((item) => item.children.findIndex((child) => key === child.key) > -1);

        const indexChild = newData[index].children.findIndex((child) => key === child.key);
        const itemChildren = newData[index].children;
        itemChildren.splice(indexChild, 1, { ...itemChildren[indexChild], ...row });

        setModifiedRows(modifiedRows.concat(itemChildren[indexChild]));
      }
      setData(newData);
      setEditingKey('');       
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleCommit = async () => {
    
  }

  const columns = [
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
    {
      title: 'Operación',
      dataIndex: 'operation',
      render: (_, record) => {
        if (record.children){
          return (
            <MinusOutlined/>
          )
        }
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:void(0)"
              onClick={() => handleSave(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Guardar
            </a>
            <Popconfirm title="¿Desea cancelar?" onConfirm={cancel}>
              <a>Cancelar</a>
            </Popconfirm>
          </span>
        ) : (
          <>
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Editar
          </Typography.Link>
          <Divider type="vertical"/>
          <Popconfirm title="¿Desea borrar la fila?" onConfirm={() => handleDelete(record.key)}>
              <a>Eliminar</a>
          </Popconfirm>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'date' ? 'crop_type' : 'yield_values',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
        <Row justify="space-between">
          <Col>
            <Button
              onClick={handleAdd}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              Añadir fila
            </Button>
          </Col>
          <Col>
            <Button
              onClick={handleCommit}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              Aplicar cambios
            </Button>
          </Col>
        </Row>

      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};


export default EditableTable;
