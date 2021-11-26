import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/client";
import {
  Cascader,
  Table,
  Typography,
  Popconfirm,
  Form,
  Button,
  Divider,
  Row,
  Col,
  notification,
  DatePicker,
  InputNumber,
  Spin
} from "antd";
import { MinusOutlined } from "@ant-design/icons";
import moment from "moment";
import { nanoid } from "nanoid";

const cropTypesOptions = [
  {
    value: "mango",
    label: "Mango",
    children: [
      {
        value: "Mango",
        label: "Todas las variedades",
      },
      {
        value: "Mango Genérico",
        label: "Mango Genérico",
      },
      {
        value: "Mango Irwin",
        label: "Mango Irwin",
      },
      {
        value: "Mango Keitt",
        label: "Mango Keitt",
      },
      {
        value: "Mango Kent",
        label: "Mango Kent",
      },
      {
        value: "Mango Manzanillo",
        label: "Mango Manzanillo",
      },
      {
        value: "Mango Osteen",
        label: "Mango Osteen",
      },

      {
        value: "Mango Palmer",
        label: "Mango Palmer",
      },

      {
        value: "Mango Sensation",
        label: "Mango Sensation",
      },

      {
        value: "Mango Tommy Atkins",
        label: "Mango Tommy Atkins",
      },
    ],
  },
  {
    value: "aguacate",
    label: "Aguacate",
    children: [
      {
        value: "Aguacate",
        label: "Todas las variedades",
      },
      {
        value: "Aguacate Bacon",
        label: "Aguacate Bacon",
      },
      {
        value: "Aguacate Cocktail",
        label: "Aguacate Cocktail",
      },
      {
        value: "Aguacate Fuerte",
        label: "Aguacate Fuerte",
      },
      {
        value: "Aguacate Gween",
        label: "Aguacate Gween",
      },
      {
        value: "Aguacate Hass",
        label: "Aguacate Hass",
      },
      {
        value: "Aguacate Lamb Hass",
        label: "Aguacate Lamb Hass",
      },
      {
        value: "Aguacate Maluma Hass",
        label: "Aguacate Maluma Hass",
      },
      {
        value: "Aguacate Melón",
        label: "Aguacate Melón",
      },
      {
        value: "Aguacate Pinkerton",
        label: "Aguacate Pinkerton",
      },
      {
        value: "Aguacate Reed",
        label: "Aguacate Reed",
      },
      {
        value: "Aguacate Zutano",
        label: "Aguacate Zutano",
      },
    ],
  },
];

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
  const inputNode =
    inputType === "date" ? (
      <DatePicker />
    ) : inputType === "crop_type" ? (
      <Cascader
        placeholder="Elija el tipo de cultivo"
        style={{ width: "100%" }}
        options={cropTypesOptions}
      />
    ) : (
      <InputNumber />
    );

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
  const [session] = useSession();
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [modifiedRows, setModifiedRows] = useState([]);
  const [deletedRows, setDeletedRows] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      date: moment(),
      crop_type: [],
      yield_values: "",
      ...record,
    });

    // The current row being edited is set by its key
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleAdd = () => {
    const newData = [...data];
    const id = nanoid(8);
    const newRow = {
      key: id,
      uid: id,
      date: moment(undefined),
      crop_type: "",
      yield_values: "",
    };

    newData.push(newRow);
    setData(newData);
  };

  const handleDelete = (key) => {
    var row = null;
    var newData = [...data];
    const rowToDelete = newData.findIndex((item) => item.key === key);

    if (rowToDelete != -1) {
      row = newData[rowToDelete];
      row.date = row.date.format("YYYY-MM-DD");
      row.crop_type = row.crop_type[1];

      newData = newData.filter((item) => item.key !== key);
      setData(newData);
    } else {
      const index = newData.findIndex(
        (item) => item.children.findIndex((child) => key === child.key) > -1
      );
      const indexChild = newData[index].children.findIndex(
        (child) => key === child.key
      );
      row = newData[index].children[indexChild];
      row.date = row.date.format("YYYY-MM-DD");
      row.crop_type = row.crop_type[1];

      newData[index].children.splice(indexChild, 1);
      setData(newData);
    }

    var index = deletedRows.findIndex((r) => r.uid == row.uid);
    index > -1
      ? setDeletedRows(deletedRows.map((r) => (r.uid !== row.uid ? r : row)))
      : setDeletedRows(deletedRows.concat(row));
  };

  const handleSave = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const rowToSave = newData.findIndex((item) => item.key === key);
      if (rowToSave != -1) {
        newData.splice(rowToSave, 1, { ...newData[rowToSave], ...row });

        row.key = newData[rowToSave].key;
        row.uid = newData[rowToSave].uid;
      } else {
        const index = newData.findIndex(
          (item) => item.children.findIndex((child) => key === child.key) > -1
        );
        const indexChild = newData[index].children.findIndex(
          (child) => key === child.key
        );
        const itemChildren = newData[index].children;
        itemChildren.splice(indexChild, 1, {
          ...itemChildren[indexChild],
          ...row,
        });

        row.key = itemChildren[indexChild].key;
        row.uid = itemChildren[indexChild].uid;
      }

      row.date = row.date.format("YYYY-MM-DD");
      row.crop_type = row.crop_type[1];

      var index = modifiedRows.findIndex((r) => r.uid == row.uid);
      index > -1
        ? setModifiedRows(
            modifiedRows.map((r) => (r.uid !== row.uid ? r : row))
          )
        : setModifiedRows(modifiedRows.concat(row));

      setData(newData);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleCommit = async () => {
    const rowChanges = [modifiedRows, deletedRows];
    await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v1/data/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(rowChanges),
    })
      .then((res) => {
        if (res.ok || res.status == 404) {
          return res.json();
        }
        return res.text().then((text) => {
          throw new Error(text);
        });
      })
      .then((result) => {
        if (result.detail == "Upsert data error") {
          notification["error"]({
            message:
              "Se ha producido un error al añadir o modificar los datos.",
          });
        } else if (result.detail == "Delete data error") {
          notification["error"]({
            message: "Se ha producido un error al eliminar los datos.",
          });
        } else {
          notification.open({
            message:
              "Se han aplicado los cambios correctamente. Por favor recargue la página.",
          });
        }
      })
      .catch((err) => {
        notification["error"]({
          message: "Ha ocurrido un error al conectarse con el servidor",
          description: `${err}`,
        });
      });
  };

  const columns = [
    {
      title: "Fecha",
      dataIndex: "date",
      editable: true,
      sorter: {
        compare: (a, b) => a.date.diff(b.date),
      },
      render: (_, record) => {
        if (record.children) {
          return record.date.format("YYYY-MM");
        } else {
          return record.date.format("YYYY-MM-DD");
        }
      },
    },
    {
      title: "Tipo de cultivo",
      dataIndex: "crop_type",
      editable: true,
      render: (_, record) => record.crop_type[1],
    },
    {
      title: "Kilos",
      dataIndex: "yield_values",
      editable: true,
    },
    {
      title: "Operación",
      dataIndex: "operation",
      render: (_, record) => {
        if (record.children) {
          return <MinusOutlined />;
        }
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="link"
              ghost
              onClick={() => handleSave(record.key)}
              style={{
                marginRight: 8,
                padding: 0,
              }}
            >
              Guardar
            </Button>
            <Popconfirm title="¿Desea cancelar?" onConfirm={cancel}>
              <a>Cancelar</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Editar
            </Typography.Link>
            <Divider type="vertical" />
            <Popconfirm
              title="¿Desea borrar la fila?"
              onConfirm={() => handleDelete(record.key)}
            >
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
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const parseToCascader = (child) => {
    var parent = child.split(" ")[0].toLowerCase();
    return [parent, child];
  };

  useEffect(async () => {
    setIsLoading(true);
    await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/v1/data/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    })
      .then((res) => {
        if (res.ok || res.status == 404) {
          return res.json();
        }
        return res.text().then((text) => {
          throw new Error(text);
        });
      })
      .then((result) => {
        if (result.detail == "Specified data not found") {
          notification["error"]({
            message: "No se han encontrado los datos.",
            description: `${err}`,
          });
        } else {
          result = result.data;
          var id, i, j;
          for (i = 0; i < result.length; i++) {
            id = nanoid(8);
            result[i]["key"] = id;
            result[i]["crop_type"] = parseToCascader(result[i]["crop_type"]);
            result[i]["date"] = moment(result[i]["date"]);
            result
            for (j = 0; j < result[i].children.length; j++) {
              result[i].children[j]["key"] = result[i].children[j]["uid"];
              result[i].children[j]["date"] = moment(
                result[i].children[j]["date"]
              );
              result[i].children[j]["crop_type"] = parseToCascader(
                result[i].children[j]["crop_type"]
              );
            }
          }
          setData(result);
        }
      })
      .catch((err) => {
        notification["error"]({
          message: "Ha ocurrido un error al conectarse con el servidor",
          description: `${err}`,
        });
      });
      setIsLoading(false);
  }, []);

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

      {isLoading && <Spin />}

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
