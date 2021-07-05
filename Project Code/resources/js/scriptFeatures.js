/* To do: Add some navigation features here that make the site flow better */


function makeInvisible(id)
{
    document.getElementById("student_status").style.visibility = 'hidden'
    document.getElementById("student_status").style.height = '0px'
}

function viewStudentStats(id, toggle)
{
	if(id=='student_status')
	{
		if(toggle =='1')
		{
			document.getElementById("student_status").style.visibility = 'visible'
			document.getElementById("student_status").style.height = 'auto'
		}
		else
		{
			document.getElementById("student_status").style.visibility = 'hidden'
			document.getElementById("undergrad_select").style.visibility = 'hidden'
			document.getElementById("grad_select").style.visibility = 'hidden'
			document.getElementById("student_status").style.height = '0px'
		}
	}
	else if(id =='undergrad_select')
	{
		if(toggle =='1')
		{
			document.getElementById("undergrad_select").style.visibility= 'visible'
			document.getElementById("undergrad_select").style.height = 'auto'
		}
		else
		{
			document.getElementById("undergrad_select").style.visibility = 'hidden'
			document.getElementById("undergrad_select").style.height = '0px'
		}
	}
	else if(id =='grad_select')
	{
		if(toggle =='1')
		{
			document.getElementById("grad_select").style.visibility= 'visible'
			document.getElementById("grad_select").style.height = 'auto'
		}
		else
		{
			document.getElementById("grad_select").style.visibility = 'hidden'
			document.getElementById("grad_select").style.height = '0px'
		}
	}
} 