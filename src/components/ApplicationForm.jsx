
function ApplicationForm(props) {
  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const application = {
      id: props.application ? props.application.id : Date.now(),
      company: form.elements.company.value.trim(),
      role: form.elements.role.value.trim(),
      date: form.elements.date.value,
      status: form.elements.status.value,
      jobLink: form.elements.jobLink.value.trim(),
      notes: form.elements.notes.value.trim(),
      interviewDate: form.elements.interviewDate.value,
    };

    if (props.application) {
      props.onUpdateApplication(application);
    } else {
      props.onAddApplication(application);
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-purple-100 bg-[#FBF9FF] p-5 sm:p-6">
      <h2 className="mb-5 text-xl font-bold text-[#30245A]">
        {props.application ? "Edit Application" : "Add New Application"}
      </h2>

      <form
        key={props.application ? props.application.id : "new"}
        onSubmit={handleSubmit}
        className="grid gap-4 sm:grid-cols-2"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Company Name
          </label>
          <input
            name="company"
            type="text"
            defaultValue={props.application?.company || ""}
            placeholder="e.g. Infosys"
            required
            className="w-full rounded-xl border border-purple-100 bg-white p-3 outline-none focus:border-purple-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Job Role
          </label>
          <input
            name="role"
            type="text"
            defaultValue={props.application?.role || ""}
            placeholder="e.g. React JS Intern"
            required
            className="w-full rounded-xl border border-purple-100 bg-white p-3 outline-none focus:border-purple-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Applied Date
          </label>
          <input
            name="date"
            type="date"
            defaultValue={
              props.application?.date ||
              new Date().toLocaleDateString("en-CA")
            }
            required
            className="w-full rounded-xl border border-purple-100 bg-white p-3 outline-none focus:border-purple-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Application Status
          </label>
          <select
            name="status"
            defaultValue={props.application?.status || "Applied"}
            className="w-full rounded-xl border border-purple-100 bg-white p-3 outline-none focus:border-purple-400"
          >
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Job Posting Link
          </label>
          <input
            name="jobLink"
            type="url"
            defaultValue={props.application?.jobLink || ""}
            placeholder="https://company.com/jobs/123"
            className="w-full rounded-xl border border-purple-100 bg-white p-3 outline-none focus:border-purple-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Interview Date
          </label>
          <input
            name="interviewDate"
            type="date"
            defaultValue={props.application?.interviewDate || ""}
            className="w-full rounded-xl border border-purple-100 bg-white p-3 outline-none focus:border-purple-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Notes
          </label>
          <input
            name="notes"
            type="text"
            defaultValue={props.application?.notes || ""}
            placeholder="e.g. Prepare React and JavaScript"
            className="w-full rounded-xl border border-purple-100 bg-white p-3 outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-[#8063D8] px-5 py-3 font-semibold text-white hover:bg-[#6D50C4]"
          >
            {props.application ? "Update Application" : "Save Application"}
          </button>

          <button
            type="button"
            onClick={props.onCancel}
            className="rounded-xl border border-purple-200 bg-white px-5 py-3 font-semibold text-[#65547E] hover:bg-purple-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;
