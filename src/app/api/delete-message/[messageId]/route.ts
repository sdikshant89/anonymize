import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { genResponse } from '@/utils/ResponseGenerator';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return genResponse(false, 'User not Authenticated', 401);
    }
    const currUser: User = session?.user as User;

    const updatedResult = await UserModel.updateOne(
      {
        _id: currUser._id,
      },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount == 0) {
      return genResponse(false, 'Message not found/ already deleted', 404);
    }
    return genResponse(true, 'messages deleted', 200);
  } catch (err) {
    console.log('Error getting messages');
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return genResponse(
      false,
      'Error deleting message',
      500,
      null,
      errorMessage
    );
  }
}
