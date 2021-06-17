import Link from "next/link";

import { Result, Button } from "antd";

const AccessDenied = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Lo siento, no estás autorizado a acceder a esta página."
      extra={
        <Link href="/">
          <Button type="link">Volver</Button>
        </Link>
      }
    />
  );
};

export default AccessDenied;
