<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

This is the <b>Portlet B</b> portlet in View mode.

<div ng-controller="TestPortletsCtrl">
{{myValue}}
</div>

<div ng-controller="BPortletController">
{{myValue}}
</div>