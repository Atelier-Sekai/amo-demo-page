function getFormData() {
  const form = document.querySelector('form');
  const data = {};
  // Helper to get value or null
  const get = id => {
    const el = document.getElementById(id);
    if (!el) return null;
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'file') return el.files[0] ? el.files[0].name : null;
    return el.value || null;
  };
  data.amo_id = null; // Not present in form
  data.internal_id = get('internal_id');
  data.municipal_id = get('municipal_id') ? Number(get('municipal_id')) : null;
  data.municipality = null; // Not present in form
  data.title = get('title');
  data.scope_of_work = get('scope_of_work');
  data.objectives = get('objectives');
  data.additional_comments = get('additional_comments') ? get('additional_comments').split('\n') : [];
  data.category = get('category');
  data.subcategory = get('subcategory');
  data.nature_of_investment = get('nature_of_investment');
  data.latitude = get('latitude') ? parseFloat(get('latitude')) : null;
  data.longitude = get('longitude') ? parseFloat(get('longitude')) : null;
  data.start = get('start');
  data.eoc = get('eoc');
  data.eof = get('eof');
  data.total_budget = get('total_budget');
  data.ccbf_budgeted = get('ccbf_budgeted');
  data.ccbf_allocated = get('ccbf_allocated') ? parseFloat(get('ccbf_allocated')) : null;
  data.other_federal_funds = get('other_federal_funds') === 'yes' ? true : get('other_federal_funds') === 'no' ? false : null;
  data.provincial_funds = get('provincial_funds');
  data.stacking_limits = get('stacking_limits');
  data.signage = get('signage');
  data.signage_intentions = get('signage_intentions');
  data.signage_rationale = get('signage_rationale') ? parseFloat(get('signage_rationale')) : null;
  data.signage_type = get('signage_type');
  data.file_uploaded = get('file_uploaded');
  data.links = get('links');
  data.status = get('status');
  data.assignee = get('assignee') ? parseFloat(get('assignee')) : null;
  return data;
}

async function provideFeedback(field) {
  // Map field to request_type
  let request_type = null;
  if (field === 'title') request_type = 'title';
  else if (field === 'scope_of_work') request_type = 'scope';
  else if (field === 'objectives') request_type = 'objective';
  else request_type = field;

  const data = getFormData();
  const inputModel = { data, request_type };
  try {
    const response = await fetch('127.0.0.1:8000/application-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputModel)
    });
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    alert('Feedback: ' + (result.feedback || 'No feedback received.'));
  } catch (err) {
    alert('Failed to get feedback: ' + err.message);
  }
} 