/**
 * This file should execute on the Issue Navigator. It will add a html fragment
 * to the Navigator on the 'Priority' field column. This is merely a hack. There's
 * no real great way to obtain this in Jira -- The Priority field implements the
 * 'View' and that isn't easily overridden. So instead, we resort to a small script
 * of javascript to augment the navigator when the page is updated.
 *
 * Foremost, we need to bind to the page. This is important because we want Jira to
 * be done loading, so that the page elements we expect are avaliable.
 *
 * Next, we need to bind to a few events, so that we can bind to new HTML that is
 * inserted. These are pageLoad (jira loaded a page dynamically), issueTableRefreshed
 * (jira loaded the issuenavigator dynamically), and issueTableRowRefreshed (jira
 * updated a row in the navigator dynamically).
 *
 * The 'addLabelToPriorityIcon' function is designed to operate with a list of issuerow.
 * Thus in all of these bindings we're seeking the selector for the html class 'issuerow'.
 * Then, we find the priority 'img' tag, as it has the name and description as attributes.
 * Finally, we append some HTML back into that column.
 */
AJS.toInit(function () {
    JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e, context, reason) {
        if (reason === JIRA.CONTENT_ADDED_REASON.pageLoad) {
            addLabelToPriorityIcon(AJS.$(context).find('.navigator-content table#issuetable tr.issuerow'));

        } else if (reason === JIRA.CONTENT_ADDED_REASON.issueTableRefreshed) {
            addLabelToPriorityIcon(AJS.$(context).find('tr.issuerow'));

        } else if (reason === JIRA.CONTENT_ADDED_REASON.issueTableRowRefreshed) {
            addLabelToPriorityIcon(context);

        }
    });

    addLabelToPriorityIcon(AJS.$('.navigator-content table#issuetable tr.issuerow'));
});

function addLabelToPriorityIcon(context) {
    AJS.$(context).find('td.priority img').each(function () {
        var $that = AJS.$(this);
        var labelStr = $that.attr('alt');

        var newHtml = '<span class="priority-label">' +
            labelStr +
            '</span>';

        var titleStr = $that.attr('title');
        var titleParts = titleStr.split(' - ');
        var titleHeader =
            '<div class="priority-tooltip-header">' +
            titleParts[0] +
            '</div>';
        var titleDescription =
            '<div class="priority-tooltip-body">' +
            titleParts[1] +
            '</div>';
        var titleHtml =
            '<span>' +
            titleHeader +
            titleDescription +
            '</span>';

        $that.parent()
            .append(newHtml)
            .attr('title', titleHtml)
            .tooltip({html: true});
    });
}
