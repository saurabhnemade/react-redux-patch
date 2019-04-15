import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { map, assign, union, omit, flattenDeep } from 'lodash';

export function flattenMyTree(tree) {
    function recurse(nodes, path) {
        return map(nodes, (node) => {
            const newPath = union(path, [node.path]);
            return [
                assign({ pathname: newPath.join(' > '), level: path.length }, omit(node, 'children')),
                recurse(node.children, newPath),
            ];
        });
    }
    return flattenDeep(recurse(tree, []));
}

export function getRoutesFromConfig(routes) {
    if (!routes) {
        return null;
    }
    const routesComponent = [];
    const flattenRoutes = flattenMyTree(routes);
    for (let i = 0; i < flattenRoutes.length; i++) {
        const component = (
            <Route
                name={flattenRoutes[i].name}
                path={flattenRoutes[i].path}
                exact={flattenRoutes[i].exact || true}
                component={flattenRoutes[i].component}
                key={flattenRoutes[i].key}
            />
        );
        routesComponent.push(component);
    }
    return routesComponent;
}

export function getRoutes(routes) {
    return (
        <Switch>
            {getRoutesFromConfig(routes)}
        </Switch>
    );
}