import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import IdeskNavigation from './IdeskNavigation';

const getPathTree = (departmentTree, url) => {
  function findPath(node, _url) {
    // If current node matches search node, return tail of path result
    if (node.url === _url) {
      return [];
    }
    // If current node not search node match, examine children. For first
    // child that returns an array (path), prepend current node to that
    // path result
    if (node.children) {
      // eslint-disable-next-line no-restricted-syntax
      for (const child of node.children) {
        const childPath = findPath(child, _url);
        if (Array.isArray(childPath)) {
          childPath.unshift(child);
          return childPath;
        }
      }
    }
    return false;
  }
  const response = findPath(departmentTree, url);
  return response || [];
};

function IdeskPageBreadcrumb({ className }) {
  const { pathname } = useLocation();
  const pathArr = getPathTree(IdeskNavigation, pathname);

  return (
    <div className={clsx('', className)}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          className="font-semibold hover:underline"
          color="secondary"
          to="/Idesk"
          role="button"
        >
          Idesk
        </Link>
        {pathArr.map((item) => (
          <Typography key={item.id} className="cursor-default">
            {item.title}
          </Typography>
        ))}
      </Breadcrumbs>
    </div>
  );
}

export default IdeskPageBreadcrumb;
