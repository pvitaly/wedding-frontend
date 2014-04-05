<?php
$con=mysqli_connect("vitalypeker.com","vitaly","Ibanezprs7!","vkwedding");
// Check connection
if (mysqli_connect_errno())
{
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$result = mysqli_query($con,"SELECT * FROM GUEST WHERE STATUS NOT LIKE '%wait%'");

echo "<table border='1'>
<tr>
<th>Guest Name</th>
<th>Status</th>
<th>Plus One</th>
<th>Plus One Name</th>
<th>Party Size</th>
<th>Message From Guest</th>
</tr>";

while($row = mysqli_fetch_array($result))
{
  echo "<tr>";
  echo "<td>" . $row['GUEST_NAME'] . "</td>";
  echo "<td>" . $row['STATUS'] . "</td>";
  echo "<td>" . $row['PLUS_ONE'] . "</td>";
  echo "<td>" . $row['PLUS_ONE_NAME'] . "</td>";
  echo "<td>" . $row['TOTAL_PARTY_SIZE'] . "</td>";
  echo "<td>" . $row['MESSAGE_FROM_GUEST'] . "</td>";
  echo "</tr>";
}
echo "</table>";

$result = mysqli_query($con, 'SELECT count(TOTAL_PARTY_SIZE) AS value_count FROM GUEST WHERE STATUS LIKE "%accept%"'); 
$row = mysqli_fetch_assoc($result); 
$count = "<div><h4>Total people RSVPed: " . $row['value_count'] . "</h4></div>";

echo $count;

$result = mysqli_query($con, 'SELECT count(STATUS) AS value_count FROM GUEST WHERE STATUS LIKE "%accept%"'); 
$row = mysqli_fetch_assoc($result); 
$count_accept = "<div><h4>Total people Accepted: " . $row['value_count'] . "</h4></div>";

echo $count_accept;

$result = mysqli_query($con, 'SELECT count(STATUS) AS value_count FROM GUEST WHERE STATUS LIKE "%decl%"'); 
$row = mysqli_fetch_assoc($result); 
$count_decline = "<div><h4>Total people Declined: " . $row['value_count'] . "</h4></div>";

echo $count_decline;

$result = mysqli_query($con, 'SELECT SUM(TOTAL_PARTY_SIZE) AS value_sum FROM GUEST WHERE STATUS LIKE "%accept%"'); 
$row = mysqli_fetch_assoc($result); 
$sum = "<div><h4>Total people coming: " . $row['value_sum'] . "</h4></div>";

echo $sum;

mysqli_close($con);
?>