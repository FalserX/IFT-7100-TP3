import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser, softDeleteUser } from "../../../../libs/user";
import { RoleType } from "../../../../types/role";
import {
  ReadUsersResult,
  UserAdminUpdateInputType,
  UserFieldSubset,
  UserOwnerUpdateInputType,
  WriteUsersResult,
} from "../../../../types/user";
import { authorizeServerRequest } from "../../../../libs/server-auth";
import { AuthorizationResult } from "../../../../types/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { requester, errorResponse }: AuthorizationResult =
    await authorizeServerRequest({
      allowedRoles: [RoleType.ADMIN],
      resourceOwnerId: params.id,
    });
  if (errorResponse) {
    return NextResponse.json(
      { error: errorResponse.errorMessage },
      { status: errorResponse.errorStatus }
    );
  }

  const { success, error, data }: ReadUsersResult = await getUserById(
    params.id,
    !!requester?.role?.includes(RoleType.ADMIN)
  );
  if (!success) {
    return NextResponse.json(
      { error: error?.errorMessage },
      { status: error?.errorStatus }
    );
  }
  return NextResponse.json({ data: data }, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { requester, errorResponse }: AuthorizationResult =
    await authorizeServerRequest({
      allowedRoles: [RoleType.ADMIN],
      resourceOwnerId: params.id,
    });

  if (errorResponse) {
    return NextResponse.json(
      { error: errorResponse.errorMessage },
      { status: errorResponse.errorStatus }
    );
  }
  let body: UserAdminUpdateInputType | UserOwnerUpdateInputType | null = null;
  try {
    if (requester?.role?.includes(RoleType.ADMIN)) {
      body = await request.json();
    } else if (requester?.id === params.id) {
      body = await request.json();
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "errors.users.user.forbidden" },
      { status: 403 }
    );
  }

  const { success, error }: WriteUsersResult = await updateUser(
    params.id,
    body as Record<string, UserFieldSubset>
  );
  if (!success) {
    return NextResponse.json(
      { error: error?.errorMessage },
      { status: error?.errorStatus }
    );
  }
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { requester, errorResponse }: AuthorizationResult =
    await authorizeServerRequest({
      allowedRoles: [RoleType.ADMIN],
      resourceOwnerId: params.id,
    });

  if (errorResponse) {
    return NextResponse.json(
      { error: errorResponse.errorMessage },
      { status: errorResponse.errorStatus }
    );
  }
  let body: UserAdminUpdateInputType | UserOwnerUpdateInputType | null = null;
  try {
    if (requester?.role?.includes(RoleType.ADMIN)) {
      body = await request.json();
    } else if (requester?.id === params.id) {
      body = await request.json();
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "errors.users.user.forbidden" },
      { status: 403 }
    );
  }

  const { success, error }: WriteUsersResult = await updateUser(
    params.id,
    body as Record<string, UserFieldSubset>
  );
  if (!success) {
    return NextResponse.json(
      { error: error?.errorMessage },
      { status: error?.errorStatus }
    );
  }
  return new NextResponse(null, { status: 204 });
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { errorResponse }: AuthorizationResult = await authorizeServerRequest({
    allowedRoles: [RoleType.ADMIN],
    resourceOwnerId: params.id,
  });

  if (errorResponse) {
    return NextResponse.json(
      { error: errorResponse.errorMessage },
      { status: errorResponse.errorStatus }
    );
  }
  const { success, error }: WriteUsersResult = await softDeleteUser(params.id);
  if (!success) {
    return NextResponse.json(
      { error: error?.errorMessage },
      { status: error?.errorStatus }
    );
  }
  return new NextResponse(null, { status: 204 });
}
