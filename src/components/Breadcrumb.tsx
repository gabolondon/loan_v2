import React from 'react';
    import { Link, useLocation } from 'react-router-dom';

    interface BreadcrumbProps {
      location: ReturnType<typeof useLocation>;
    }

    export const Breadcrumb: React.FC<BreadcrumbProps> = ({ location }) => {
      const pathSegments = location.pathname
        .split('/')
        .filter((segment) => segment);

      const breadcrumbs = pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <span key={url}>
            {!isLast ? (
              <>
                <Link to={url} className="text-gray-600 hover:text-gray-800">
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
                <span className="mx-2 text-gray-400">/</span>
              </>
            ) : (
              <span className="text-gray-800 font-medium">
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </span>
            )}
          </span>
        );
      });

      return (
        <div className="mb-4 text-sm">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          {breadcrumbs.length > 0 && (
            <span className="mx-2 text-gray-400">/</span>
          )}
          {breadcrumbs}
        </div>
      );
    };
