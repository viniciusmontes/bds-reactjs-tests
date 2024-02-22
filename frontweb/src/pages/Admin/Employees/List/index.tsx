import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { requestBackend } from 'util/requests';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { hasAnyRoles } from 'util/auth';

type ControlComponents = {
  activePage: number;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();

  const [controlComponents, setControlComponents] = useState<ControlComponents>(
    {
      activePage: 0,
    }
  );

  const getEmployes = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      withCredentials: true,
      params: {
        page: controlComponents.activePage,
        size: 3,
      },
    }
    requestBackend(config).then((response) => {
      setPage(response.data);
      console.log(page);
    });
  }, [controlComponents]);

  useEffect(() => {
    getEmployes();
  }, [getEmployes]);

  const handlePageChange = (pageNumber: number) => {
    setControlComponents({ activePage: pageNumber });
  };

  return (
    <>
      {hasAnyRoles(['ROLE_ADMIN']) && (
        <Link to="/admin/employees/create">
        <button className="btn btn-primary text-white btn-crud-add">
          ADICIONAR
        </button>
      </Link>
      )}

      <div className="row">
        {page?.content.map((employee) => (
          <div key={employee.id} className="col-sm-6 col-md-12">
            <EmployeeCard employee={employee}/>
          </div>
        ))}
      </div>

      <Pagination
        forcePage={page?.number}
        pageCount={page ? page.totalElements : 0}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
