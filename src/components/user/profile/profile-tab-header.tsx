const ProfileTabHeader = ({
  headerTitle,
  activeBanner,
}: {
  headerTitle: string;
  activeBanner: boolean;
}) => {
  return (
    <div className="flex flex-col bg-gray-700 text-white -mx-6 -mt-6 rounded-t-xl">
      <div className="flex">
        <h2 className="flex p-4 font-bold text-2xl">{headerTitle}</h2>
      </div>
      {activeBanner ? (
        <div className="flex p-2 mt-2 text-white bg-amber-700 text-left justify-start">
          {"warning-box "}
          {"errors.users.user.profile.warning.required"}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProfileTabHeader;
