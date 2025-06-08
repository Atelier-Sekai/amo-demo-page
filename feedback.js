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

function getOrCreateFeedbackBox(field) {
  let input = document.getElementById(field);
  if (!input) return null;
  // Find the parent div (label+button wrapper)
  let parentDiv = input.closest('div') || input.parentElement;
  // Try to find an existing feedback box
  let feedbackBox = parentDiv.querySelector('.feedback-box');
  if (!feedbackBox) {
    feedbackBox = document.createElement('div');
    feedbackBox.className = 'feedback-box';
    feedbackBox.style.marginTop = '6px';
    feedbackBox.style.fontSize = '0.95em';
    feedbackBox.style.color = '#0055a5';
    feedbackBox.style.background = '#f0f8ff';
    feedbackBox.style.border = '1px solid #b3d8fd';
    feedbackBox.style.borderRadius = '4px';
    feedbackBox.style.padding = '8px';
    feedbackBox.style.minHeight = '24px';
    parentDiv.appendChild(feedbackBox);
  }
  return feedbackBox;
}

async function provideFeedback(field) {
  let request_type = null;
  if (field === 'title') request_type = 'title';
  else if (field === 'scope_of_work') request_type = 'scope';
  else if (field === 'objectives') request_type = 'objective';
  else request_type = field;

  const data = getFormData();
  const inputModel = { data, request_type };
  const apiMeta = document.querySelector('meta[name="api-url"]');
  const API_URL = apiMeta ? apiMeta.content : '';

  // Find the feedback button and feedback box
  const input = document.getElementById(field);
  let parentDiv = input.closest('div') || input.parentElement;
  const button = parentDiv.querySelector('.feedback-btn');
  const feedbackBox = getOrCreateFeedbackBox(field);

  // UI: disable button and show loading
  if (button) {
    button.disabled = true;
    button.textContent = 'Loading...';
    button.style.opacity = '0.7';
    button.style.cursor = 'not-allowed';
  }
  if (feedbackBox) {
    feedbackBox.textContent = 'Awaiting feedback...';
    feedbackBox.style.color = '#888';
    feedbackBox.style.background = '#f7f7f7';
    feedbackBox.style.border = '1px dashed #bbb';
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputModel)
    });
    if (!response.ok) throw new Error('API error');
    const result = await response.json();
    if (feedbackBox) {
      feedbackBox.textContent = result.feedback || 'No feedback received.';
      feedbackBox.style.color = '#0055a5';
      feedbackBox.style.background = '#f0f8ff';
      feedbackBox.style.border = '1px solid #b3d8fd';
    }
  } catch (err) {
    if (feedbackBox) {
      feedbackBox.textContent = 'Failed to get feedback: ' + err.message;
      feedbackBox.style.color = '#b30000';
      feedbackBox.style.background = '#fff0f0';
      feedbackBox.style.border = '1px solid #ffb3b3';
    }
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = 'Provide me feedback';
      button.style.opacity = '';
      button.style.cursor = '';
    }
  }
}

function loadDummyData() {
  const dummy = {
    amo_id: 17205,
    internal_id: "02-603001",
    municipal_id: 10302,
    municipality: "Ottawa, City of",
    title: "Improvements to TD Place",
    scope_of_work: "Work involves replacing arena facilities at TD Place - the home to the Ottawa 67's.",
    objectives: "We are rehabilitating the arena to ensure safety, keep the asset in good condition, and facilitate wayfinding. Improve arena conditions for professional sports team use year round",
    additional_comments: [],
    category: "Sports",
    subcategory: null,
    nature_of_investment: "Renewal",
    latitude: 43.2067105,
    longitude: -79.6139763,
    start: "2023-01-01",
    eoc: "2023-05-31",
    eof: "2023-05-31",
    total_budget: "$50,000.00",
    ccbf_budgeted: "$39,584.81",
    ccbf_allocated: 50000.0,
    other_federal_funds: false,
    provincial_funds: "No",
    stacking_limits: "No",
    signage: "Not posted",
    signage_intentions: null,
    signage_rationale: null,
    signage_type: "Physical",
    file_uploaded: "No",
    links: null,
    status: "Approved",
    assignee: null
  };
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'SELECT') {
      if (value === null || value === undefined) el.value = '';
      else {
        // Only set if option exists
        const opt = Array.from(el.options).find(o => o.value == value);
        el.value = opt ? value : '';
      }
    } else if (el.type === 'checkbox') {
      el.checked = !!value;
    } else if (el.type === 'file') {
      // Cannot set file input for security reasons
    } else if (el.type === 'number') {
      el.value = value === null || value === undefined ? '' : value;
    } else {
      el.value = value === null || value === undefined ? '' : value;
    }
  };
  set('internal_id', dummy.internal_id);
  set('municipal_id', dummy.municipal_id);
  set('title', dummy.title);
  set('scope_of_work', dummy.scope_of_work);
  set('objectives', dummy.objectives);
  set('category', dummy.category);
  set('subcategory', dummy.subcategory);
  set('nature_of_investment', dummy.nature_of_investment);
  set('latitude', dummy.latitude);
  set('longitude', dummy.longitude);
  set('start', dummy.start);
  set('eoc', dummy.eoc);
  set('eof', dummy.eof);
  // Remove $ and commas for number fields
  set('total_budget', dummy.total_budget ? dummy.total_budget.replace(/[$,]/g, '') : '');
  set('ccbf_budgeted', dummy.ccbf_budgeted ? dummy.ccbf_budgeted.replace(/[$,]/g, '') : '');
  set('ccbf_allocated', dummy.ccbf_allocated);
  set('other_federal_funds', dummy.other_federal_funds === true ? 'yes' : dummy.other_federal_funds === false ? 'no' : '');
  set('provincial_funds', dummy.provincial_funds === null ? '' : dummy.provincial_funds.toLowerCase());
  set('stacking_limits', dummy.stacking_limits);
  set('signage', dummy.signage);
  set('signage_intentions', dummy.signage_intentions);
  set('signage_rationale', dummy.signage_rationale);
  set('signage_type', dummy.signage_type);
  set('status', dummy.status);
  set('assignee', dummy.assignee);
  // Textareas
  const addComments = document.getElementById('additional_comments');
  if (addComments) addComments.value = (dummy.additional_comments && dummy.additional_comments.length) ? dummy.additional_comments.join('\n') : '';
  const links = document.getElementById('links');
  if (links) links.value = dummy.links || '';
}

function updateSubcategories() {
  const category = document.getElementById('category');
  const subcategory = document.getElementById('subcategory');
  if (category && subcategory) {
    if (category.value === 'Local Roads and Bridges') {
      subcategory.disabled = false;
    } else {
      subcategory.value = '';
      subcategory.disabled = true;
    }
  }
} 