/**
 * @name NoGenericErrors
 * @description Detects when a service in Nest.js throws a generic Error object instead of a custom error object.
 * @kind problem
 * @problem.severity warning
 * @tags nestjs
 *       security
 */

import javascript

// Find all methods that belong to a Nest.js service.
from NestServiceMethod method, MethodAccess access
where method.getEnclosingType().getQualifiedName().matches("^(.*)\\.service\\..*$")
  and access.getTarget() = method

// Find all throw statements that throw an Error object.
from ThrowStatement throwStmt
where throwStmt.getException().getType().toString() = "Error"

// Ensure the throw statement is in a Nest.js service method.
where throwStmt.getParent().(MethodAccess).getTarget() = method

// Report the issue.
select throwStmt, "Service method is throwing a generic Error object instead of a custom error object."
