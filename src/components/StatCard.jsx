
function StatCard(props) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <p className="text-sm font-medium text-[#8580A5]">
        {props.title}
      </p>

      <h2 className="mt-4 text-3xl font-extrabold text-[#25275D]">
        {props.value}
      </h2>

      <div className="mt-4 h-1.5 w-12 rounded-full bg-gradient-to-r from-[#A58BEF] to-[#E5C7F2]" />
    </div>
  );
}

export default StatCard;
